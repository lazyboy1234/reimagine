"""Build a compact, illustrative highway garden deck in metric Blender units.

Run with Blender --background --python build_deck.py. Geometry is a design
assumption, not a surveyed reconstruction or a structural feasibility model.
"""
import json
import math
import random
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
random.seed(138)
LENGTH = 240.0
WIDTH = 34.0
ROAD_WIDTH = 30.0
PARK_Z = 9.6
CUT_Y = -40.0

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.scale_length = 1.0
collections = {}
for name in ('Highway', 'Structure', 'Landscape', 'Furniture', 'People', 'Context', 'Presentation'):
    coll = bpy.data.collections.new(name)
    scene.collection.children.link(coll)
    collections[name] = coll

def material(name, rgb, roughness=0.8, metallic=0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*rgb, 1)
    mat.use_nodes = True
    node = mat.node_tree.nodes.get('Principled BSDF')
    node.inputs['Base Color'].default_value = (*rgb, 1)
    node.inputs['Roughness'].default_value = roughness
    node.inputs['Metallic'].default_value = metallic
    return mat

M = {
    'concrete': material('Warm structural concrete', (.60, .58, .51)),
    'road': material('Asphalt', (.095, .11, .12)),
    'paint': material('White lane markings', (.91, .9, .83)),
    'paving': material('Pale permeable paving', (.70, .68, .59)),
    'soil': material('Engineered planting soil', (.21, .14, .08)),
    'grass': material('Community lawn', (.25, .42, .18)),
    'meadow': material('Native planting beds', (.36, .43, .20)),
    'wood': material('Timber seating', (.37, .23, .12)),
    'metal': material('Dark railings', (.09, .13, .12), .45, .4),
    'play': material('Play garden soft surface', (.27, .52, .57)),
    'blue': material('Blue play equipment', (.10, .38, .59)),
    'yellow': material('Yellow play equipment', (.91, .56, .12)),
    'trunk': material('Tree bark', (.23, .16, .10)),
    'glass': material('Smoky pavilion glazing', (.21, .34, .36), .22),
    'brick': material('Muted brick context', (.40, .27, .23)),
    'building': material('Warm gray context', (.55, .53, .49)),
    'ground': material('Site base', (.76, .75, .70)),
    'skin': material('People skin', (.65, .44, .29)),
}
leaves = [material('Tree canopy %d' % i, color) for i, color in enumerate([
    (.14, .29, .11), (.23, .38, .12), (.29, .43, .15), (.36, .47, .18)])]
car_mats = [material('Vehicle %d' % i, color, .3, .2) for i, color in enumerate([
    (.72, .73, .70), (.17, .27, .34), (.43, .12, .09), (.15, .17, .18), (.83, .82, .74)])]
shirt_mats = [material('Clothing %d' % i, color) for i, color in enumerate([
    (.24, .34, .46), (.68, .33, .18), (.36, .46, .30), (.75, .67, .44)])]

def move(obj, group, mat):
    for coll in list(obj.users_collection):
        coll.objects.unlink(obj)
    collections[group].objects.link(obj)
    if mat:
        obj.data.materials.append(mat)
    return obj

def box(name, xyz, size, mat, group='Structure', bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=xyz)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    move(obj, group, mat)
    if bevel:
        mod = obj.modifiers.new('Small edge radius', 'BEVEL')
        mod.width = bevel
        mod.segments = 2
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=mod.name)
    return obj

def cylinder(name, xyz, radius, depth, mat, group='Furniture', vertices=12):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=xyz)
    obj = bpy.context.object
    obj.name = name
    return move(obj, group, mat)

def ellipsoid(name, xyz, scale, mat, group, subdivisions=2):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivisions, radius=1, location=xyz)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return move(obj, group, mat)

# Six lanes on a representative straight road. The supports sit outside the
# 30 m carriageway. No median piers or lane reductions are introduced.
box('Six-lane roadway', (0, 0, -.18), (ROAD_WIDTH, LENGTH + 64, .36), M['road'], 'Highway')
box('Central barrier', (0, 0, .48), (.8, LENGTH + 64, .96), M['concrete'], 'Highway')
for side in (-1, 1):
    for x in (1.4, 12.25):
        box('Shoulder line', (side*x, 0, .012), (.12, LENGTH + 64, .024), M['paint'], 'Highway')
    for x in (4.9, 8.4):
        for y in range(-148, 153, 12):
            box('Lane dash', (side*x, y, .018), (.12, 4, .025), M['paint'], 'Highway')
    for y in range(-116, 117, 8):
        box('Outer abutment', (side*16.15, y, 4.1), (1.7, 8, 8.2), M['concrete'])
    for y in (-138, 138):
        box('Portal approach barrier', (side*14.65, y, .65), (.5, 28, 1.3), M['concrete'], 'Highway')

# Split the slab and beams into pieces so the cutaway has an exact, clean edge.
for y in range(-116, 117, 8):
    for x in range(-16, 17, 2):
        box('Deck slab', (x, y, 8.2), (2, 8, .8), M['concrete'])
        box('Lightweight fill', (x, y, 9.05), (2, 8, .9), M['paving'])
    for side in (-1, 1):
        box('Transverse girder', (side*8.5, y, 7.2), (17, .85, 1.2), M['concrete'])

def tree(x, y):
    height = random.uniform(6.5, 9.0)
    cylinder('Tree trunk', (x, y, PARK_Z + height*.35), .19, height*.7, M['trunk'], 'Landscape')
    canopy = ellipsoid('Broadleaf canopy', (x, y, PARK_Z + height*.73), (2.2, 2.7, height*.36), random.choice(leaves), 'Landscape', 3)
    # A subtle irregular canopy, avoiding a perfect geometric sphere.
    for vertex in canopy.data.vertices:
        factor = 1 + .08*math.sin(vertex.co.x*11 + vertex.co.y*7 + vertex.co.z*13)
        vertex.co *= factor

def bench(x, y, rotation=0):
    parts = [
        box('Bench seat', (x, y, PARK_Z+.45), (.55, 2.1, .12), M['wood'], 'Furniture', .035),
        box('Bench back', (x+.23, y, PARK_Z+.77), (.09, 2.1, .48), M['wood'], 'Furniture', .025)]
    for dy in (-.75, .75):
        parts.append(box('Bench leg', (x, y+dy, PARK_Z+.21), (.35, .09, .42), M['metal'], 'Furniture'))
    if rotation:
        for obj in parts:
            offset = obj.location - Vector((x, y, 0))
            obj.location.x = x + math.cos(rotation)*offset.x - math.sin(rotation)*offset.y
            obj.location.y = y + math.sin(rotation)*offset.x + math.cos(rotation)*offset.y
            obj.rotation_euler.z = rotation

for y in range(-116, 117, 8):
    for side in (-1, 1):
        box('Engineered tree strip', (side*14.25, y, PARK_Z+.08), (5.5, 8, .25), M['meadow'], 'Landscape')
        box('Planting soil section', (side*14.25, y, 9.17), (5.1, 8, .6), M['soil'], 'Landscape')
        box('Accessible promenade', (side*9.5, y, PARK_Z), (4, 8, .16), M['paving'], 'Landscape')
        box('Low planting curb', (side*11.55, y, PARK_Z+.2), (.2, 8, .4), M['concrete'], 'Landscape')
        box('Edge parapet', (side*16.85, y, PARK_Z+.4), (.3, 8, .8), M['concrete'], 'Landscape')
        box('Edge rail', (side*16.85, y, PARK_Z+1.25), (.06, 8, .06), M['metal'], 'Furniture')
        for offset in (-3, 1):
            cylinder('Rail post', (side*16.85, y+offset, PARK_Z+1), .035, .7, M['metal'], 'Furniture', 8)
    for side in (-1, 1):
        if -72 <= y <= 72:
            ground = M['grass']
        elif y < -72:
            ground = M['play']
        else:
            ground = M['paving']
        box('Park surface', (side*3.75, y, PARK_Z+.03), (7.5, 8, .2), ground, 'Landscape')

for side in (-1, 1):
    for y in range(-110, 113, 12):
        tree(side*14.3, y + random.uniform(-1, 1))
    for y in range(-100, 101, 20):
        bench(side*10.8, y, math.pi if side < 0 else 0)
        cylinder('Path light', (side*8, y+5, PARK_Z+2.4), .065, 4.8, M['metal'])
        box('Light head', (side*8, y+5, PARK_Z+4.8), (.5, .3, .14), M['concrete'], 'Furniture')

# Cross paths divide the long lawn into smaller, useful neighborhood spaces.
for y in (-72, -24, 24, 72):
    for side in (-1, 1):
        box('Cross path', (side*3.75, y, PARK_Z+.15), (7.5, 2.5, .14), M['paving'], 'Landscape')

# Small neighborhood pavilion and cafe terrace, rather than a large building.
for x in (-5, 5):
    for y in (90, 104):
        cylinder('Pavilion column', (x, y, PARK_Z+1.9), .14, 3.8, M['metal'])
box('Pavilion roof', (0, 97, PARK_Z+4.05), (12, 18, .35), M['wood'], 'Furniture', .08)
box('Cafe kiosk', (0, 104, PARK_Z+1.4), (6, 4, 2.8), M['building'], 'Furniture', .08)
box('Cafe window', (0, 101.94, PARK_Z+1.8), (4.7, .08, 1.4), M['glass'], 'Furniture')
for x in (-4, 0, 4):
    for y in (81, 86):
        cylinder('Cafe table', (x, y, PARK_Z+.8), .7, .12, M['wood'])
        cylinder('Table pedestal', (x, y, PARK_Z+.37), .09, .74, M['metal'])
        for dy in (-1, 1):
            box('Cafe chair', (x, y+dy, PARK_Z+.5), (.5, .5, .14), M['metal'], 'Furniture')

# Modest play area within the deck footprint.
for x, y in ((-3,-100),(3,-90)):
    box('Play platform', (x,y,PARK_Z+1.4), (2.4,2.4,.25), M['yellow'], 'Furniture', .05)
    for dx in (-.95,.95):
        for dy in (-.95,.95):
            cylinder('Play post', (x+dx,y+dy,PARK_Z+.72), .075, 1.44, M['blue'])
    slide = box('Small slide', (x+2,y,PARK_Z+.85), (3, .85,.16), M['blue'], 'Furniture', .04)
    slide.rotation_euler.y = math.radians(24)
for y in (-106, -98, -90):
    cylinder('Play stepping disc', (5,y,PARK_Z+.18), .65, .36, M['yellow'])

def person(x, y):
    shirt = random.choice(shirt_mats)
    ellipsoid('Person torso', (x,y,PARK_Z+1.1), (.22,.16,.4), shirt, 'People')
    ellipsoid('Person head', (x,y,PARK_Z+1.64), (.14,.14,.17), M['skin'], 'People')
    for dx in (-.10,.10):
        cylinder('Person leg', (x+dx,y,PARK_Z+.38), .065,.75,M['metal'],'People',8)
    for dx in (-.26,.26):
        cylinder('Person arm', (x+dx,y,PARK_Z+1.02), .055,.58,shirt,'People',8)

for _ in range(46):
    person(random.choice((-9.5,9.5))+random.uniform(-1,1),random.uniform(-114,114))
for _ in range(12):
    person(random.uniform(-5,5), random.uniform(78,88))

def vehicle(x,y,truck=False):
    mat = random.choice(car_mats)
    if truck:
        box('Truck cargo', (x,y,1.65), (2.45,8,3.1), M['paint'], 'Highway', .08)
        box('Truck cab', (x,y-5.1,1.3), (2.35,2.1,2.5), mat, 'Highway', .12)
    else:
        box('Car body', (x,y,.6), (1.85,4.4,.85), mat, 'Highway', .18)
        box('Car cabin', (x,y+.1,1.12), (1.6,2.35,.65), M['glass'], 'Highway', .12)
    for dx in (-.92,.92):
        for dy in (-1.4,1.4):
            wheel = cylinder('Vehicle wheel', (x+dx,y+dy,.35), .33,.18,M['metal'],'Highway')
            wheel.rotation_euler.y = math.pi/2

for side in (-1,1):
    for i,x in enumerate((3.15,6.65,10.15)):
        for y in (-139,-112,-77,-38,7,51,96,137):
            vehicle(side*x,y+random.uniform(-4,4),truck=(i==2 and y in (-139,-77,51)))

# Compact, abstract context. It is deliberately not a GIS reconstruction.
box('Presentation ground', (0,0,-1), (120,360,1.1),M['ground'],'Presentation')
for side in (-1,1):
    box('Illustrative adjacent street', (side*21,0,-.15), (6,LENGTH+30,.3),M['road'],'Context')
    box('Illustrative sidewalk', (side*25,0,.05), (2,LENGTH+30,.4),M['paving'],'Context')
    for y in (-105,-66,-27,12,51,90):
        height = random.uniform(13,24)
        x = side*34
        box('Context building', (x,y,height/2), (16,29,height),M['brick'] if side<0 else M['building'],'Context', .1)
        box('Building roof coping', (x,y,height+.2),(16.4,29.4,.4),M['concrete'],'Context')
        for z in range(3,int(height)-1,3):
            for dy in range(-10,11,4):
                box('Context window', (x-side*8.05,y+dy,z), (.08,1.6,1.7),M['glass'],'Context')

scene.world.use_nodes = True
scene.world.node_tree.nodes['Background'].inputs[0].default_value = (.74,.80,.88,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value = .55
bpy.ops.object.light_add(type='SUN', location=(70,-90,130))
sun = bpy.context.object
sun.name = 'Afternoon sunlight'
sun.data.energy = 2.4
sun.data.angle = math.radians(18)
sun.rotation_euler = (math.radians(25),math.radians(-18),math.radians(-25))
move(sun,'Presentation',None)

def camera(name, xyz, target, scale):
    bpy.ops.object.camera_add(location=xyz)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_euler = (Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
    obj.data.type = 'ORTHO'
    obj.data.ortho_scale = scale
    obj.data.clip_end = 1500
    move(obj,'Presentation',None)
    return obj

overview = camera('Park overview', (155,-220,220),(0,0,7),278)
cutcam = camera('Deck cutaway', (165,-235,180),(0,-4,4),278)
sectioncam = camera('Cross section', (78,-13,32),(0,0,6),49)
scene.camera = overview
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 32
scene.cycles.use_denoising = True
scene.render.resolution_x = 1600
scene.render.resolution_y = 1100
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.view_settings.view_transform = 'AgX'
scene.render.film_transparent = False
for folder in ('renders','exports'):
    (ROOT/folder).mkdir(exist_ok=True)

mesh_objects = [obj for coll in collections.values() for obj in coll.objects if obj.type=='MESH' and coll.name!='Presentation']

def export(name):
    bpy.ops.object.select_all(action='DESELECT')
    for obj in mesh_objects:
        if not obj.hide_render:
            obj.hide_set(False)
            obj.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(ROOT/'exports'/name),export_format='GLB',use_selection=True,export_yup=True)

def render(name, cam):
    scene.camera = cam
    scene.render.filepath = str(ROOT/'renders'/name)
    bpy.ops.render.render(write_still=True)

export('deegan-garden-deck.glb')
render('park-overview.png',overview)

# Remove a quadrant for presentation only. Roadway stays continuous underneath.
cut_hidden = []
for obj in mesh_objects:
    if obj.users_collection[0].name not in ('Highway',) and obj.location.x > 0 and obj.location.y < CUT_Y:
        obj.hide_render = True
        cut_hidden.append(obj)
export('deegan-garden-deck-cutaway.glb')
render('deck-cutaway.png',cutcam)
for obj in cut_hidden:
    obj.hide_render = False

# Show a representative 8 m cross-section module with clear lane widths.
section_hidden = []
for obj in mesh_objects:
    if obj.users_collection[0].name == 'Context' or abs(obj.location.y)>4:
        obj.hide_render=True
        section_hidden.append(obj)
render('cross-section.png',sectioncam)
for obj in section_hidden:
    obj.hide_render=False
for obj in mesh_objects:
    obj.hide_set(False)
scene.camera=overview
for obj in bpy.context.selected_objects:
    obj.select_set(False)
scene['Concept status'] = 'Illustrative dimensions only. No surveyed Deegan geometry or engineering validation.'
scene['Deck dimensions'] = '240 m length x 34 m width; traffic footprint 30 m; three lanes each direction.'
scene['Cutaway'] = 'Removed presentation quadrant, not a proposed gap in the park.'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'deegan-garden-deck.blend'))

manifest = {
    'status':'Illustrative architectural concept; not surveyed or structurally validated',
    'units':'meters',
    'deck_length_m':LENGTH,'deck_width_m':WIDTH,'deck_area_m2':LENGTH*WIDTH,
    'deck_area_acres':round(LENGTH*WIDTH/4046.8564224,2),
    'roadway_width_m':ROAD_WIDTH,'lanes_each_direction':3,'lane_width_m':3.5,
    'girder_underside_m':6.6,'park_surface_m':PARK_Z,
    'supports':'Side abutments outside roadway; no supports in vehicle lanes',
    'cutaway':'One deck quadrant omitted for visibility; not a construction proposal',
    'limitations':['Road grades, ramps, utilities, clearance and right of way are not surveyed.',
                   'Loads, foundations, fire safety, tunnel ventilation, drainage and access require engineering.',
                   'No modeled PM2.5 improvement or construction cost is claimed.'],
    'mesh_objects':len(mesh_objects),
    'deliverables':['deegan-garden-deck.blend','exports/deegan-garden-deck.glb',
                    'exports/deegan-garden-deck-cutaway.glb','renders/park-overview.png',
                    'renders/deck-cutaway.png','renders/cross-section.png']
}
(ROOT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps(manifest),flush=True)
