import requests
import json
import datetime as dt


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

paradas = list() 

j=json.loads(web_pg)
for f in j['features']:
    parada = {}
    fgeom = json.loads(json.dumps(f['geometry'])) 
    fobj = json.loads(json.dumps(f['properties']))
    pobj = json.loads(json.dumps(fobj))

    #print(fgeom)
    cobj = json.dumps(fgeom['coordinates'])

    parada['id'] = pobj['cod_ubic_parada']
    parada['desc_parada'] = pobj['desc_ubic_parada']
    parada['via1'] = pobj['cod_nombre_via_1']
    parada['via2'] = pobj['cod_nombre_via_2']
    parada['geom'] = cobj
    parada['habilitada'] = 'true' if pobj['comentario_ubic_deshabilitada'] is None else 'false'
    paradas.append(parada)

print ("Paso 1 - Carga de paradas")

print ("Paso 2 - Creando Archivo")

f = open("C:/Users/Usuario/Documents/Tecnologo/UTU2021S05/TSIG/Proyecto/Recursos/paradas.sql", "w")

for det in paradas:
    consulta = 'INSERT INTO ft_paradas (id, descripcion, codvia1, codvia2, geom, habilitada) '
    consulta += 'VALUES(' + str(det['id']) + ', '
    consulta += '\'' + det['desc_parada'] + '\', '
    consulta += str(det['via1']) + ', '
    consulta += str(det['via2']) + ', '
    consulta += 'ST_GeometryFromText(\'POINT(' + str(det['geom']).replace(',', '').replace('[', '').replace(']','') + ')\', 32721), '
    consulta += det['habilitada'] + ');\n' 
    f.write(consulta)

f.close()

print ("FIN DEL PROCESO")

