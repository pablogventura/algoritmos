def raiz_cubica_newton_raphson(S, tol=1e-10, max_iter=100000):
    # Estimación inicial (puede ser cualquier valor razonable, S/2 es una opción)
    x_n = S / 2.0 if S != 0 else 0.1
    
    for i in range(max_iter):
        # Aplicar la fórmula de Newton-Raphson
        x_n1 = (2 * x_n + S / (x_n ** 2)) / 3
        
        # Verificar si la diferencia es suficientemente pequeña
        if abs(x_n1 - x_n) < tol:
            return x_n1
        
        x_n = x_n1
    
    # Retornar el valor obtenido después de max_iter iteraciones (podría no ser óptimo)
    return x_n

# Ejemplo de uso
S = 27
resultado = raiz_cubica_newton_raphson(S)
print(f"La raíz cúbica aproximada de {S} es: {resultado}")
