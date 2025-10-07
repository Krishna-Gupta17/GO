# GO

## Location Search (Free / No API Key)

The journey tracker now uses free open data services (Photon + fallback to OpenStreetMap Nominatim) for location autocomplete and geocoding.

Highlights:
- No API key or billing details required.
- Debounced queries (450ms) to stay polite.
- Photon queried first (fast & good global coverage), falls back to Nominatim if empty or failing.
- Results limited (max 5) to reduce bandwidth.
- Selecting a result stores its coordinates & locks them once journey starts.

Attribution: Data © OpenStreetMap contributors.

If you self-host or scale this feature, add a proper User-Agent + referer header and consider a local geocoding proxy with caching to respect provider usage policies.












Authentication approach. In my website, i want to make authentication of user i which i want his details, some documents and verify his email and password. Email verification is through link by firebase. After verifacation and each documents , i will be authenticated and data will be stored in mongoDb, file will be sored in firebase storage and link will stored in mongoDb,.