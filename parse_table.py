import json

from lxml import etree

with open('table.html') as f:
    root = etree.HTML(f.read())

print(root)

values = [[td for td in tr.xpath('td//font//text()')] for tr in root.xpath('//tr')]

print(json.dumps(values))
