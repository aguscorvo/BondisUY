import requests
import json
import datetime as dt


CUTCSA = ['4', '21', '60', '62', '77', '100', '102', '102', '106', '103', '104', '105', '106', '109', '110', '111', '112', '113', '115', '116', '117', '121', '124', '125', '127', '128', '130', '133', '135', '137', '141', '142', '143', '144', '145', '147', '148', '149', '150', '151', '155', '156', '157', '158', '163', '169', '174', '175', '180', '181', '182', '183', '185', '186', '187', '188', '191', '192', '195', '199', 'CE1', 'G3', 'G6', 'G8', 'G10', 'G11', 'DE1', 'E14', 'D2', 'D3', 'D5', 'D8', 'D10', 'DM1', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L15', 'L17', 'L18', 'L20', 'L21', 'L22', 'L23', 'L26', 'L28', 'L30', 'L35', 'L36', 'L37', 'L41', 'L46', 'L63', 'L64', '214', '227', '230', '268', '276', 'C1', 'C2', 'C3', 'C4', 'C4D', 'C5', '124 SD', 'L34', '140', '60 SD', 'L31', '169 SD', '103SD', 'L27', '64', 'L94']
UCOT = ['17', '71', '79', '300', '306', '316', '328', '329', '330', '370', '396', 'L12', 'L13', 'DM1', '11A', '11C', '11T', '11S', 'XA1', 'LM12', 'LM13']
COETC = ['CE1', 'G', '2', '76', '402', '404', '405', '407', '409', '427', '456', '494', '495', 'D9', 'L7', 'L14', 'L16', 'L17', 'L18', 'L19', 'L29', '4A', '4AC', '4AD', '4D', '4DD', '4DR', '4DR', '5D', '48D', '222D', '222', '600', 'DM1']
COMESA = ['505', '522', '524', '526', '538', '546', '582', 'L24', 'L25', 'D11', 'DM1', '1M1', '1M2', '1M3', '1M4', '1M5', '1M6', '1M7', '1M11', '1M12', '1M13', '1M14', '1M15', '1M16', '1M17', '2M1', '2M2', '2M3', '2M5', '2M6', '2M7', '2M8', 'ML1', 'ML2', 'DL1', 'DL2']


url = 'http://geoserver.montevideo.gub.uy/geoserver/ows'

query = {"SERVICE":"WFS",
    "VERSION": "1.1",
    "REQUEST": "GetFeature",
    "typeName": "ide:ide_v_uptu_lsv",
    "outputFormat": "application/json"}

headers = {
    'User-Agent': 'BondisUY.FING'
}

r = requests.get(url, params=query, headers=headers)
r.encoding = "ANSI"
web_pg=r.text

lineas = {}
recorridos = list()

print ("Paso 1 - Carga de lineas y recorridos")

flog = open("lineasRecorrido.log", "w")

j=json.loads(web_pg)
for f in j['features']:
    newline = {}
    newrecorrido = {}
    fgeom = json.loads(json.dumps(f['geometry'])) 
    prop = json.loads(json.dumps(f['properties']))
    company = 'null'
    
    try:
        if prop["desc_linea"] in CUTCSA:
            company = 'CUTCSA'
        elif prop["desc_linea"] in UCOT:
            company = 'UCOT'
        elif prop["desc_linea"] in COETC:
            company = 'COETC'
        elif prop["desc_linea"] in COMESA:
            company = 'COMESA'

        newline['cod_linea'] = prop['cod_linea']
        newline['desc_linea'] = prop['desc_linea']
        newline['company'] = company

        if prop['cod_linea'] not in lineas:
            lineas[prop['cod_linea']]=newline
    
        newrecorrido["cod_linea"] = prop["cod_linea"]
        newrecorrido["cod_recorrido"] = prop["cod_variante"]
        newrecorrido["descripcion"] = prop["desc_sublinea"]
        newrecorrido["coordinates"] = fgeom['coordinates']
									
        recorridos.append(newrecorrido)
        
    except Exception as e:
        flog.write('Exception: ' + str(e) + '\n')

flog.close()

print ("Paso 2 - Creación archivo de lineas")

f = open("lineas.sql", "w")

for lin in lineas:
    consulta = 'INSERT INTO lineas (id, destino, nombre, origen, compania_id) '
    consulta += 'VALUES(' + str(lineas[lin]['cod_linea']) + ',\'\' ,\''
    consulta += lineas[lin]['desc_linea'] + '\', \'\','
    if lineas[lin]['company']=='null':
        consulta += lineas[lin]['company']
    else:
        consulta += '(SELECT id FROM companias WHERE nombre=\'' + lineas[lin]['company'] + '\')'
    
    consulta += ');\n'
    f.write(consulta)
f.close()

print ("Paso 2 - Creación archivo de recorridos")

f = open("recorridos.sql", "w")

#print(recorridos)
for rec in recorridos:
    i = 0
    consulta = 'INSERT INTO ft_recorridos (id, activo, descripcion, linea_id, geom, fecha) '
    consulta += 'VALUES(' + str(rec['cod_recorrido']) + ', true,\''
    consulta += rec['descripcion'] + '\', '
    consulta += str(rec['cod_linea']) + ', '
    consulta +=  'ST_GeometryFromText(\'LINESTRING('
    for g in rec["coordinates"]:
        consulta += str(g[0]) + ' ' + str(g[1])
        if i < len(rec["coordinates"]):
            consulta += ','

        i += 1
    consulta += ')\', 32721), now());\n'
    f.write(consulta)

f.write('INSERT INTO lineas_ft_recorridos (linea_id, recorridos_id) SELECT linea_id, id FROM ft_recorridos;\n')
f.close()

print ("FIN DEL PROCESO")
