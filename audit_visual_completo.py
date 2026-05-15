import sys, subprocess, time, os, json, urllib.request
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
ALL_ROUTES = [
    # Public pages (static ○)
    "/", "/categorias", "/carrito", "/membresias", "/nosotros", "/contacto",
    "/terminos", "/privacidad", "/devoluciones", "/ayuda", "/pagos",
    "/productos", "/productos/comparar", "/servicios", "/blog",
    # Auth
    "/auth/login", "/auth/register", "/auth/forgot-password", "/auth/verify",
    # Dynamic public
    "/productos/como-funciona-el-sistema-mlm-de-saidonclub",
    "/proveedor/demo-provider",
    # Dashboard (will redirect to login)
    "/dashboard", "/dashboard/profile", "/dashboard/pedidos", "/dashboard/ventas",
    "/dashboard/citas", "/dashboard/network", "/dashboard/wishlist",
    "/dashboard/withdraw", "/dashboard/transfer", "/dashboard/exchange-points",
    "/dashboard/ticker", "/dashboard/scripts", "/dashboard/security", "/dashboard/settings",
    # Admin
    "/admin", "/admin/users", "/admin/kyc", "/admin/withdrawals",
    "/admin/products", "/admin/services", "/admin/providers",
    "/admin/providers/debt", "/admin/audit", "/admin/warnings",
    "/admin/multimedia", "/admin/config",
    # Provider
    "/provider", "/provider/products", "/provider/services", "/provider/appointments",
    # Auditor
    "/auditor", "/auditor/transactions",
]

VIEWPORTS = [
    ("mobile", 375, 812),
    ("tablet", 768, 1024),
    ("desktop", 1440, 900),
]

def start_server():
    proc = subprocess.Popen("pnpm --filter web dev", shell=True,
        cwd=os.path.dirname(os.path.abspath(__file__)),
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for i in range(60):
        time.sleep(2)
        try:
            urllib.request.urlopen(BASE, timeout=5)
            return proc
        except:
            pass
    return None

REPORT = {}

server = start_server()
if not server:
    print("FAILED TO START SERVER")
    sys.exit(1)

os.makedirs("screenshots/phase2", exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    for route in ALL_ROUTES:
        url = BASE + route
        label = route.replace("/", "_").replace("-", "_") or "_root"
        REPORT[route] = {"issues": [], "viewports": {}}
        print(f"\n{'='*60}")
        print(f"CHECKING: {route}")
        
        for vp_name, width, height in VIEWPORTS:
            context = browser.new_context(viewport={"width": width, "height": height})
            page = context.new_page()
            
            try:
                page.goto(url, wait_until="load", timeout=30000)
                page.wait_for_timeout(3000)
                
                issues = page.evaluate("""() => {
                    const r = [];
                    
                    // 1. Overlapping detection using bounding rects
                    const allEls = [...document.querySelectorAll('*')].filter(el => {
                        const s = getComputedStyle(el);
                        return s.display !== 'none' && s.visibility !== 'hidden' && 
                               el.offsetWidth > 0 && el.offsetHeight > 0;
                    });
                    
                    for (let i = 0; i < Math.min(allEls.length, 500); i++) {
                        const a = allEls[i];
                        const ra = a.getBoundingClientRect();
                        if (ra.width === 0 || ra.height === 0) continue;
                        
                        for (let j = i + 1; j < Math.min(allEls.length, 500); j++) {
                            const b = allEls[j];
                            const rb = b.getBoundingClientRect();
                            
                            // Check if b is significantly overlapping a
                            const overlapX = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
                            const overlapY = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
                            const overlapArea = overlapX * overlapY;
                            const areaA = ra.width * ra.height;
                            
                            if (areaA > 0 && overlapArea / areaA > 0.4 && overlapArea > 2500) {
                                const ta = (a.textContent || '').trim().slice(0, 30);
                                const tb = (b.textContent || '').trim().slice(0, 30);
                                if (ta && tb && ta !== tb) {
                                    r.push({ type: 'OVERLAP', a: ta, b: tb, ratio: (overlapArea/areaA*100).toFixed(0) + '%' });
                                }
                            }
                        }
                    }
                    
                    // 2. Horizontal overflow (elements wider than viewport)
                    document.querySelectorAll('*').forEach(el => {
                        const rect = el.getBoundingClientRect();
                        if (rect.width > window.innerWidth + 2 && rect.width > 50) {
                            const tag = el.tagName.toLowerCase();
                            const text = (el.textContent || '').trim().slice(0, 40);
                            const cls = (el.className || '').slice(0, 30);
                            if (text || cls) {
                                r.push({ type: 'OVERFLOW_X', tag, text: text || cls, w: Math.round(rect.width), vp: window.innerWidth });
                            }
                        }
                    });
                    
                    // 3. Text cutoff (text overflowing with hidden overflow)
                    document.querySelectorAll('*').forEach(el => {
                        const s = getComputedStyle(el);
                        if (s.overflow === 'hidden' || s.textOverflow === 'ellipsis') {
                            if (el.scrollWidth > el.clientWidth + 5 && el.clientWidth > 20) {
                                const text = (el.textContent || '').trim().slice(0, 40);
                                if (text) r.push({ type: 'TEXT_CUTOFF', tag: el.tagName, text, diff: el.scrollWidth - el.clientWidth });
                            }
                        }
                    });
                    
                    // 4. Empty containers with fixed height
                    document.querySelectorAll('div, section, main').forEach(el => {
                        const s = getComputedStyle(el);
                        const h = el.offsetHeight;
                        const text = (el.textContent || '').trim();
                        if (h > 100 && text.length < 10 && !el.querySelector('img') && !el.querySelector('iframe')) {
                            r.push({ type: 'EMPTY_CONTAINER', tag: el.tagName, h, cls: (el.className||'').slice(0,30) });
                        }
                    });
                    
                    // 5. Body too short
                    if (document.body.scrollHeight < window.innerHeight - 50) {
                        r.push({ type: 'SHORT_PAGE', bodyH: document.body.scrollHeight, vpH: window.innerHeight });
                    }
                    
                    // 6. Console errors
                    return r;
                }""")
                
                # Take screenshot
                safe = label + "_" + vp_name
                page.screenshot(path=f"screenshots/phase2/{safe}.png", full_page=True)
                
                # Collect console errors
                console_errs = []
                page.on("console", lambda msg: console_errs.append(msg.text[:150]) if msg.type == "error" else None)
                page.wait_for_timeout(500)
                
                if issues:
                    REPORT[route]["issues"].extend(issues)
                    for i in issues:
                        print(f"  [{vp_name}] {i.get('type')}: {i.get('text','') or i.get('tag','')} {i.get('w','')}")
                
                if console_errs:
                    for e in console_errs[:3]:
                        if "404" in e or "Failed" in e or "Error" in e:
                            print(f"  [{vp_name}] CONSOLE: {e[:100]}")
                            REPORT[route]["issues"].append({"type": "CONSOLE", "msg": e[:150]})
                
            except Exception as e:
                print(f"  [{vp_name}] ERROR: {str(e)[:80]}")
                REPORT[route]["issues"].append({"type": "LOAD_ERROR", "msg": str(e)[:100]})
            
            context.close()
    
    browser.close()

server.terminate()
time.sleep(2)

# Summary
print("\n\n" + "="*70)
print("FASE 2 — AUDITORIA VISUAL COMPLETA")
print("="*70)

all_issues = []
for route, data in REPORT.items():
    for i in data["issues"]:
        all_issues.append((route, i["type"], i.get("text","") or i.get("tag","") or i.get("msg","")))

by_type = {}
for r, t, msg in all_issues:
    by_type.setdefault(t, []).append((r, msg))

for t, items in sorted(by_type.items()):
    print(f"\n{t}: {len(items)} ocurrencias")
    for r, msg in items[:10]:
        print(f"  {r}: {msg[:60]}")

with open("audit_visual_results.json", "w", encoding="utf-8") as f:
    json.dump({"routes": REPORT, "summary": {t: len(v) for t, v in by_type.items()}}, f, ensure_ascii=False, indent=2)
print(f"\nReporte completo guardado en audit_visual_results.json")
