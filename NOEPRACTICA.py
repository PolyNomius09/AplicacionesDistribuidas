import math

# ==========================================
# 1. CONFIGURACIÓN Y DATOS
# ==========================================

# Parámetros del Enlace (Link Budget)
P_tx_watts = 10.0
P_tx_dbm = 10 * math.log10(P_tx_watts * 1000) # Convertimos 10W a 40 dBm
G_tx_dbi = 9.0
G_rx_dbi = 3.0

# Bandera para el tipo de entorno
# True = Metropolitano (kf usa 0.7)
# False = No Metropolitano / Suburbano (kf usa 1.5)
ES_METROPOLITANO = True 

# Lista de diccionarios con los 8 Puntos
datos_puntos = [
    # 1er Punto
    {"id": 1, "f": 1935.0, "hr": 6.2033, "dhb": 13.7967, "b": 17.242, "d": 0.48988, "phi": 50.95, "dhm": 4.7033, "w": 8.49},
    # 2do Punto
    {"id": 2, "f": 1935.0, "hr": 6.3242, "dhb": 13.6758, "b": 16.5833, "d": 0.54761, "phi": 53.49, "dhm": 4.8742, "w": 9.79},
    # 3er Punto
    {"id": 3, "f": 1935.0, "hr": 6.3083, "dhb": 13.6917, "b": 16.5833, "d": 0.51821, "phi": 58.71, "dhm": 4.8083, "w": 9.79},
    # 4to Punto
    {"id": 4, "f": 1935.0, "hr": 6.32425, "dhb": 13.6757, "b": 16.5833, "d": 0.58539, "phi": 48.41, "dhm": 4.82425, "w": 9.79},
    # 5to Punto
    {"id": 5, "f": 1935.0, "hr": 6.2212, "dhb": 13.7787, "b": 16.3642, "d": 0.63259, "phi": 75.35, "dhm": 4.7212, "w": 10.27},
    # 6to Punto
    {"id": 6, "f": 1935.0, "hr": 6.2212, "dhb": 13.7787, "b": 16.3642, "d": 0.60318, "phi": 55.23, "dhm": 4.7212, "w": 7.62},
    # 7mo Punto
    {"id": 7, "f": 1935.0, "hr": 6.3,    "dhb": 13.7,    "b": 16.3642, "d": 0.56072, "phi": 62.05, "dhm": 4.8,    "w": 7.62},
    # 8vo Punto
    {"id": 8, "f": 1935.0, "hr": 6.5637, "dhb": 13.4363, "b": 16.3642, "d": 0.53629, "phi": 68.17, "dhm": 5.0637, "w": 7.62}
]

resultados_tabla = []

print(f"--- Iniciando cálculo para {len(datos_puntos)} puntos ---")
print(f"Modo Metropolitano: {'ACTIVADO' if ES_METROPOLITANO else 'DESACTIVADO (Suburbano)'}")
print("-" * 50)

# ==========================================
# 2. PROCESAMIENTO (CICLO FOR)
# ==========================================

for p in datos_puntos:
    # Variables auxiliares
    f_mhz = p["f"]
    d_km = p["d"]
    w = p["w"]
    delta_hm = p["dhm"]
    phi_deg = p["phi"]
    delta_hb = p["dhb"]
    b_avg = p["b"]
    
    # --- A. Cálculo de Lori ---
    if 0 <= phi_deg < 35:
        lori = -10 + 0.354 * phi_deg
    elif 35 <= phi_deg < 55:
        lori = 2.5 + 0.075 * (phi_deg - 35)
    elif 55 <= phi_deg <= 90:
        lori = 4.0 - 0.114 * (phi_deg - 55)
    else:
        lori = 0

    # --- B. Cálculo de L0 (Espacio Libre) ---
    l0 = 32.4 + 20 * math.log10(d_km) + 20 * math.log10(f_mhz)

    # --- C. Cálculo de Lrts (Tejado-Calle) ---
    lrts = -16.9 - 10 * math.log10(w) + 10 * math.log10(f_mhz) + 20 * math.log10(delta_hm) + lori

    # --- D. Cálculo de Lmsd (Multiscreen) ---
    lbsh = -18 * math.log10(1 + delta_hb)
    ka = 54
    kd = 18
    
    # Selección de kf
    if ES_METROPOLITANO:
        kf_factor = 0.7
    else:
        kf_factor = 1.5
    
    kf = -4 + kf_factor * ((f_mhz / 925.0) - 1)

    lmsd_raw = lbsh + ka + kd * math.log10(d_km) + kf * math.log10(f_mhz) - 9 * math.log10(b_avg)
    lmsd_final = max(0, lmsd_raw)

    # --- E. Pérdida Total y Prx ---
    lb_total = l0 + lrts + lmsd_final
    prx = P_tx_dbm + G_tx_dbi + G_rx_dbi - lb_total

    # Guardamos TODOS los valores individuales en el diccionario
    p["L0"] = l0
    p["Lrts"] = lrts
    p["Lmsd"] = lmsd_final
    p["Lb"] = lb_total
    p["Prx"] = prx
    resultados_tabla.append(p)

# ==========================================
# 3. IMPRESIÓN DE TABLAS
# ==========================================

# --- TABLA 1: DATOS GENERALES + RESULTADO FINAL ---
print("\n" + "="*145)
print(f"{'TABLA 1: PARÁMETROS, PÉRDIDA TOTAL Y POTENCIA RECIBIDA':^145}")
print("="*145)
header1 = (
    f"{'PTO':^4} | {'d[km]':^8} | {'f[MHz]':^8} | {'hr[m]':^7} | {'dhb[m]':^8} | "
    f"{'b[m]':^7} | {'phi[°]':^7} | {'dhm[m]':^7} | {'w[m]':^6} || "
    f"{'Lb [dB]':^12} | {'Prx [dBm]':^12}"
)
print(header1)
print("-" * 145)

for r in resultados_tabla:
    fila1 = (
        f"{r['id']:^4} | {r['d']:^8.5f} | {r['f']:^8.1f} | {r['hr']:^7.4f} | {r['dhb']:^8.4f} | "
        f"{r['b']:^7.4f} | {r['phi']:^7.2f} | {r['dhm']:^7.4f} | {r['w']:^6.2f} || "
        f"{r['Lb']:^12.4f} | {r['Prx']:^12.4f}"
    )
    print(fila1)
print("="*145)


# --- TABLA 2: DESGLOSE DE PÉRDIDAS ---
print("\n")
print("="*65)
print(f"{'TABLA 2: DESGLOSE DE PÉRDIDAS (L0, Lrts, Lmsd)':^65}")
print("="*65)

header2 = f"{'PTO':^5} | {'L0 [dB]':^14} | {'Lrts [dB]':^14} | {'Lmsd [dB]':^14}"
print(header2)
print("-" * 65)

for r in resultados_tabla:
    fila2 = (
        f"{r['id']:^5} | {r['L0']:^14.4f} | {r['Lrts']:^14.4f} | {r['Lmsd']:^14.4f}"
    )
    print(fila2)

print("="*65)