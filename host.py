# what are you doing here

import http.server
import socketserver
import os

class handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if not self.path.endswith(".html") and not "." in self.path:
            possible_html = self.path.lstrip("/") + ".html"
            if os.path.exists(possible_html):
                self.path += ".html"

        return super().do_GET()

PORT = 8020
Handler = handler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"server running on port {PORT}")
    httpd.serve_forever()
