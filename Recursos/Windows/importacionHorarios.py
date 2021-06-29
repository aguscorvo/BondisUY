import requests
import json
import datetime as dt
import time

url = 'http://geoserver.montevideo.gub.uy/geoserver/ows'
urllineas = 'http://www.montevideo.gub.uy/transporteRest/lineas/'
url_horario = 'http://www.montevideo.gub.uy/transporteRest/pasadas/'

query = {"SERVICE":"WFS",
    "VERSION": "1.1",
    "REQUEST": "GetFeature",
    "typeName": "imm:uptu_ubic_parada",
    "outputFormat": "application/json"}

headers = {
    'User-Agent': 'Mi Agente'
}

r = requests.get(url, params=query, headers=headers)
web_pg=r.text


codparada = list() 
paradas = {}
paradas_horas = list()

j=json.loads(web_pg)
for f in j['features']:
    fobj = json.loads(json.dumps(f['properties']))
    pobj = json.loads(json.dumps(fobj))
    codparada.append(pobj['cod_ubic_parada'])

print ("Paso 1 - Carga de paradas")

flog = open("horarios.log", "w")

for p in codparada:
    try:
        urln = urllineas+str(p) 
        rl = requests.get(urln)
        web_pgl=rl.text
        jl=json.loads(web_pgl)
        lineas = []
        for linea in jl['lineas']:
            lineas.append(linea['codigo'])
        paradas[p] = lineas
    except Exception as e:
        flog.write('error key' + str(p) + ' URL: ' + urln + ' Exception: ' + str(e) + '\n')


print ("Paso 2 - Carga de lineas")

for key in paradas:
    try:
        for h in paradas[key]:
            urlh = url_horario + str(key) +'/HABIL/'+ str(h)
            rh = requests.get(urlh)
            web_pgh=rh.text
            
            jh=json.loads(web_pgh)
            for horas in jh:
                hora = {}
                hora['parada'] = key
                hora['hora'] = horas['time']
                hora['ruta'] = horas['variante']
                paradas_horas.append(hora)
            time.sleep(0.001)
    except Exception as e:
        flog.write('error key' + str(key) + ' URL: ' + urlh + ' Exception: ' + str(e) + '\n')

flog.close()

print ("Paso 3 - Creando Archivo")

f = open("horarios.sql", "w")

for det in paradas_horas:
    consulta = 'INSERT INTO horarios (hora, parada_id, recorrido_id)'
    consulta += 'VALUES(\'' + dt.datetime.fromtimestamp(det['hora']/1000.0).strftime('%H:%M:%S') + '\', '
    consulta += str(det['parada']) + ', '
    consulta += str(det['ruta']) + ');\n' 
    f.write(consulta)

#f.write('INSERT INTO ft_recorridos_horarios (horarios_id, recorrido_id) SELECT id, recorrido_id FROM horarios WHERE parada_id = 2778;\n')
#f.write('INSERT INTO ft_paradas_horarios (horarios_id, parada_id) SELECT id, parada_id FROM horarios WHERE parada_id = 2778;\n')

f.close()

print ("FIN DEL PROCESO")

