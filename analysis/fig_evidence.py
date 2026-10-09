from pathlib import Path
import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
from matplotlib.colors import Normalize

P=Path(__file__).resolve().parents[1]
plt.rcParams.update({'svg.fonttype':'none','font.family':'sans-serif','font.sans-serif':['Arial','DejaVu Sans'],'font.size':11,'text.color':'#221d1a','axes.labelcolor':'#221d1a'})
rows={str(int(r['puma'])):r for r in json.loads((P/'data/raw/nfh_puma.json').read_text()) if r['goal']=='Overall Index'}
geo=json.loads((P/'data/raw/puma2010.geojson').read_text())
assert len(rows)==len(geo['features'])==55
fig,axs=plt.subplots(1,2,figsize=(11,7.2))
fig.subplots_adjust(left=.02,right=.98,top=.87,bottom=.20,wspace=.03)
fig.suptitle('Economic context: why vulnerability enters the score',x=.02,ha='left',y=.98,fontsize=17,weight='bold')
fig.text(.02,.92,'55 historical NYC PUMAs · source marked published 2020 · area statistics, not individual incomes',fontsize=11)
for ax,key,label,cmap in zip(axs,['median_income','nyc_poverty_rate'],['Reported median income (US dollars)','Poverty rate (%)'],['YlGn','YlOrRd']):
 vals=[float(r[key])*(100 if key=='nyc_poverty_rate' else 1) for r in rows.values()]
 norm=Normalize(min(vals),max(vals)); cm=plt.get_cmap(cmap)
 target=[]
 for feat in geo['features']:
  code=str(int(feat['properties']['puma'])); r=rows[code]
  value=float(r[key])*(100 if key=='nyc_poverty_rate' else 1)
  geom=feat['geometry']; polys=geom['coordinates'] if geom['type']=='MultiPolygon' else [geom['coordinates']]
  for poly in polys:
   xy=np.array(poly[0]); xy[:,0]=(xy[:,0]+74)*np.cos(np.deg2rad(40.7));xy[:,1]-=40.7
   ax.add_patch(Polygon(xy,facecolor=cm(norm(value)),edgecolor='white',linewidth=.6))
   if code=='3710':target.append(xy)
 for xy in target:ax.add_patch(Polygon(xy,fill=False,edgecolor='#a4122f',linewidth=2.5,zorder=5))
 ax.autoscale_view();ax.set_aspect('equal');ax.set_axis_off();ax.set_title(label,loc='left',fontsize=13,weight='bold',pad=12)
 cb=fig.colorbar(plt.cm.ScalarMappable(norm=norm,cmap=cm),ax=ax,orientation='horizontal',fraction=.048,pad=.035)
 cb.ax.tick_params(labelsize=10)
 if key=='median_income':cb.ax.xaxis.set_major_formatter(plt.FuncFormatter(lambda x,pos:f'${x/1000:.0f}k'))
 else:cb.ax.xaxis.set_major_formatter(plt.FuncFormatter(lambda x,pos:f'{x:.0f}%'))
fig.text(.02,.135,'Red outline: PUMA 3710, Hunts Point, Longwood & Melrose',fontsize=12,weight='bold',color='#a4122f')
fig.text(.02,.102,'Reported median income: $15,510 · poverty: 29.3% · financial-health rank: 51 of 55',fontsize=11)
fig.text(.02,.060,'Why it matters: economic resources affect the ability to cope with heat and pollution.\nThese broad-area values inform planning; they do not measure income on an East 138th block.',fontsize=10)
fig.text(.02,.010,'Sources: NYC DCWP Neighborhood Financial Health (r3dx-pew9); 2010 PUMA boundaries (k2r4-n9ax).\nThe underlying index combines indicators from different periods; “published 2020” is not a 2020-only measurement.',fontsize=8.5,color='#5b5145')
for ext in ['svg','png']:fig.savefig(P/f'story-art/fig-economics-map.{ext}',dpi=150,facecolor='white')
plt.close(fig)

rows=sorted(json.loads((P/'data/derived/tree_siting.json').read_text())['segments'],key=lambda r:r['i'])
assert len(rows)==10 and sum(r['n_trees'] for r in rows)==70
fig,ax=plt.subplots(figsize=(11,5.7));fig.subplots_adjust(left=.085,right=.98,top=.79,bottom=.32)
fig.suptitle('Where the archived tree gaps are',x=.03,ha='left',y=.97,fontsize=17,weight='bold')
fig.text(.03,.90,'East 138th Street · ten project analysis bays, each about 120 m · 2015 census',fontsize=12)
xs=range(len(rows));colors=['#416f4e' if r['action']=='plant' else '#bd7f1f' if r['canyon'] else '#b9b5ad' for r in rows]
bars=ax.bar(xs,[r['n_trees'] for r in rows],color=colors,width=.66)
for bar,r in zip(bars,rows):
 ax.text(bar.get_x()+bar.get_width()/2,r['n_trees']+.5,str(r['n_trees']),ha='center',fontsize=12,weight='bold')
 if r['canyon']:bar.set_hatch('///')
ax.axhline(7,color='#5b5145',ls='--',lw=1);ax.text(9.5,7.4,'Mean: 7 trees/bay',ha='right',fontsize=10,color='#5b5145')
ax.set_xticks(list(xs),[str(r['i']) for r in rows]);ax.set_xlabel('Analysis bay ID (not a street address)');ax.set_ylabel('Living street trees (count)');ax.set_ylim(0,24);ax.set_yticks([0,5,10,15,20]);ax.spines[['top','right']].set_visible(False)
fig.text(.03,.16,'Green: six low-count bays with modeled H/W < 0.5. Gold: bay 10 needs an airflow review.\nGray: three bays at or above the local mean. The mean is a comparison, not a planting standard.',fontsize=11)
fig.text(.03,.095,'Archived gaps identify bays worth checking; new trees and removals can change the choice.\nVerify utilities, sidewalk space and building geometry before planting.',fontsize=10)
fig.text(.03,.017,'Source: NYC 2015 Street Tree Census (uvpi-gqnh), project-derived 120 m bins.\nH/W = building height ÷ street width, a dimensionless screening ratio; it does not model pollutant dispersion.',fontsize=8.5,color='#5b5145')
for ext in ['svg','png']:fig.savefig(P/f'story-art/fig-tree-gaps.{ext}',dpi=150,facecolor='white')
print('Generated economics and tree-gap figures')
