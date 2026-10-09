"""Render archived tree locations and retained analysis bays, with matching table IDs."""
from pathlib import Path
import json
import math
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
from matplotlib.lines import Line2D
P=Path(__file__).resolve().parents[1]
cy=json.loads((P/'data/derived/canyon.json').read_text())
rows=sorted(json.loads((P/'data/derived/tree_siting.json').read_text())['segments'],key=lambda s:s['i'])
cl=cy['centerline_fit'];lon0,lat0=cl['from'];kx=111320*math.cos(math.radians(lat0));ky=111320
xy=lambda ll:((ll[0]-lon0)*kx,(ll[1]-lat0)*ky)
end=xy(cl['to']);length=math.hypot(*end);ux,uy=end[0]/length,end[1]/length
pts=[xy([t['lon'],t['lat']]) for t in cy['tree_points']]
fig,ax=plt.subplots(figsize=(11,7.4));fig.subplots_adjust(left=.05,right=.98,top=.83,bottom=.29)
plt.rcParams['svg.fonttype']='none'
fig.suptitle('The map behind the planting shortlist',x=.03,ha='left',y=.975,fontsize=19,weight='bold')
fig.text(.03,.925,'East 138th Street, Mott Haven · archived living-tree locations and about 120 m analysis bays',fontsize=11)
ax.set_facecolor('#f7f4ec')
# Public footprint outlines supply neighborhood context, not surveyed clearance.
geo=json.loads((P/'data/derived/buildings.geojson').read_text())
for feat in geo['features']:
 g=feat['geometry'];polys=g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]
 for poly in polys:
  a=[xy(ll) for ll in poly[0]]
  if any(-70<x<end[0]+70 and end[1]-120<y<120 for x,y in a):ax.add_patch(Polygon(a,facecolor='#e5e0d5',edgecolor='white',linewidth=.5,zorder=1))
ax.plot([0,end[0]],[0,end[1]],color='#777166',lw=2,ls='--',zorder=2)
for r in rows:
 a,b=xy(r['from']),xy(r['to']);c='#2a8a4a' if r['action']=='plant' else '#bd7f1f' if r['canyon'] else '#5c574f'
 ax.plot([a[0],b[0]],[a[1],b[1]],color=c,lw=7,solid_capstyle='butt',zorder=3)
 mid=((a[0]+b[0])/2,(a[1]+b[1])/2);offset=80 if rows.index(r)%2==0 else -80;lx,ly=mid[0]-uy*offset,mid[1]+ux*offset
 ax.annotate(str(r['i']),xy=mid,xytext=(lx,ly),textcoords='data',ha='center',va='center',fontsize=9,weight='bold',color=c,bbox={'boxstyle':'round,pad=.23','fc':'white','ec':c,'lw':.7},arrowprops={'arrowstyle':'-','color':c,'lw':.7},zorder=5)
ax.scatter([a[0] for a in pts],[a[1] for a in pts],s=25,color='#174636',edgecolor='white',linewidth=.7,zorder=4)
ax.set_xlim(-80,end[0]+80);ax.set_ylim(end[1]-110,160);ax.set_aspect('equal');ax.set_axis_off()
ax.annotate('N',xy=(end[0]+15,100),xytext=(end[0]+15,10),ha='center',weight='bold',arrowprops={'arrowstyle':'->','color':'#29251e'})
ax.plot([30,230],[end[1]-65,end[1]-65],color='#29251e',lw=2);ax.text(130,end[1]-92,'200 m',ha='center',fontsize=10)
legend=[Line2D([0],[0],marker='o',color='none',markerfacecolor='#174636',label='2015 living street tree'),Line2D([0],[0],color='#2a8a4a',lw=5,label='Survey candidate'),Line2D([0],[0],color='#bd7f1f',lw=5,label='Airflow review'),Line2D([0],[0],color='#5c574f',lw=5,label='At/above mean'),Line2D([0],[0],color='#777166',ls='--',label='Unscored analysis bin')]
fig.legend(handles=legend,loc='lower left',bbox_to_anchor=(.03,.185),frameon=False,ncol=3,fontsize=10)
fig.text(.03,.14,'Green = fewer than 7 archived trees and modeled H/W < 0.5. Bay 10 needs an airflow review.\nGray = at or above the archived mean; it does not mean no more trees can fit.',fontsize=11)
fig.text(.03,.074,'Ten retained bays contain 70 trees; 11 more lie outside retained bins. Four of fourteen possible bins\nwere omitted for sparse building data. The fitted straight analysis axis approximates the bending street.',fontsize=10)
fig.text(.03,.016,'Sources: 2015 Street Tree Census (uvpi-gqnh); NYC Building Footprints (5zhs-2jue).\nDots describe 2015, not today. Verify trees, geometry, utilities, access and airflow before selecting planting sites.',fontsize=9,color='#5c574f')
for ext in ['svg','png']:fig.savefig(P/f'story-art/fig-tree-availability.{ext}',dpi=150,facecolor='white')
assert len(rows)==10 and sum(r['n_trees'] for r in rows)==70 and len(pts)==81
print('Tree-location map: 81 archived tree points, ten retained bays, 70 counted trees')
