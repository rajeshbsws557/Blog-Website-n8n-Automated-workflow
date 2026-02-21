import urllib.request, re; from html.parser import HTMLParser; class MLStripper(HTMLParser):
    def __init__(self): super().__init__(); self.reset(); self.strict = False; self.convert_charrefs= True; self.text = []
    def handle_data(self, d): self.text.append(d)
    def get_data(self): return ''.join(self.text)
req = urllib.request.Request('https://4sysops.com/archives/install-an-mcp-server-for-github-copilot-in-vs-code/', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')
s = MLStripper(); s.feed(html); text = s.get_data(); print(re.sub(r'\s+', ' ', text)[:3000])
