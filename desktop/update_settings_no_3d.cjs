const fs = require('fs');
let lines = fs.readFileSync('src/components/desktop/HUD/SettingsApp.tsx', 'utf8').split('\n');

const newContent = `        {/* === COMMANDER PROFILES (Identity) === */}
        {activeTab === 'accounts' && (
          <div style={{ padding: "30px", height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", gap: "25px", color: "#fff", background: "#050B14", backgroundImage: "linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
            
            {/* Header Section */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <div style={{ fontSize: "0.7rem", color: "#00ffff", letterSpacing: "2px", fontWeight: "bold" }}>SETTINGS / IDENTITY</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold", letterSpacing: "1px" }}>Commander Profile</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>Identity, biometric, and cognitive interface configuration.</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.6rem", letterSpacing: "1px", fontWeight: "bold", color: "#fff" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00ff66", boxShadow: "0 0 8px #00ff66" }}></div>
                IDENTITY CORE<br/>STABLE
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
              <div style={{ fontSize: "0.8rem", color: "#00ffff", borderBottom: "2px solid #00ffff", paddingBottom: "8px", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Profile
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Neural Interface</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Security</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Permissions</div>
            </div>

            <div style={{ display: "flex", gap: "30px" }}>
              {/* Left Column: Portrait & Stats */}
              <div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "15px" }}>
                <div style={{ position: "relative", width: "100%", height: "350px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "4px", overflow: "hidden" }}>
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" alt="Commander Profile" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.2) sepia(1) hue-rotate(150deg) saturate(2) brightness(0.8)" }} />
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", background: "linear-gradient(transparent 50%, rgba(0, 255, 255, 0.1) 50%)", backgroundSize: "100% 4px", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", fontSize: "0.6rem", color: "#00ff66", fontWeight: "bold", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "5px", background: "rgba(0,0,0,0.8)", padding: "4px 8px", borderRadius: "10px", border: "1px solid rgba(0,255,102,0.3)" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg> 
                    IDENTITY VERIFIED
                  </div>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", padding: "5px" }}>
                  <div style={{ fontSize: "0.7rem", color: "#00ffff", fontWeight: "bold", letterSpacing: "2px" }}>PRIMARY OPERATOR</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Riyan Khan</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>COMMANDER - NOVA-01</div>
                  
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", border: "1px solid #ffaa00", color: "#ffaa00", padding: "4px 8px", borderRadius: "2px", fontSize: "0.6rem", fontWeight: "bold", letterSpacing: "1px", width: "fit-content", marginTop: "5px" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> 
                    OMEGA CLEARANCE
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px", marginTop: "10px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>LAST AUTH</span>
                    <span style={{ fontSize: "0.7rem", color: "#00ffff", fontWeight: "bold" }}>18:42:06</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>SESSION</span>
                    <span style={{ fontSize: "0.7rem", color: "#00ffff", fontWeight: "bold" }}>87H 21M</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>TRUST INDEX</span>
                    <span style={{ fontSize: "0.7rem", color: "#00ffff", fontWeight: "bold" }}>99.8</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Settings Cards */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* 01 Identity Core */}
                <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ color: "#00ffff", fontSize: "0.8rem", fontWeight: "bold" }}>01</div>
                    <div style={{ fontSize: "1rem", fontWeight: "bold", letterSpacing: "1px" }}>Identity Core</div>
                    <div style={{ fontSize: "0.5rem", background: "rgba(0,255,102,0.1)", color: "#00ff66", border: "1px solid rgba(0,255,102,0.3)", padding: "2px 6px", borderRadius: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                       SYNCHRONIZED
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>DISPLAY NAME</span>
                      <input type="text" defaultValue="Riyan Khan" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px", fontSize: "0.8rem", outline: "none", borderRadius: "2px" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>CALL SIGN</span>
                      <input type="text" defaultValue="NOVA-01" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px", fontSize: "0.8rem", outline: "none", borderRadius: "2px" }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>ROLE DESIGNATION</span>
                    <input type="text" defaultValue="System Commander / Primary Architect" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px", fontSize: "0.8rem", outline: "none", width: "100%", borderRadius: "2px" }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>LANGUAGE MATRIX</span>
                      <select style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px", fontSize: "0.8rem", outline: "none", appearance: "none", borderRadius: "2px" }}>
                        <option>English (US)</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>TIME STANDARD</span>
                      <select style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px", fontSize: "0.8rem", outline: "none", appearance: "none", borderRadius: "2px" }}>
                        <option>UTC +05:00</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 02 Biometric Signature */}
                <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ color: "#00ffff", fontSize: "0.8rem", fontWeight: "bold" }}>02</div>
                    <div style={{ fontSize: "1rem", fontWeight: "bold", letterSpacing: "1px" }}>Biometric Signature</div>
                    <div style={{ fontSize: "0.5rem", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                       <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> END-TO-END ENCRYPTED
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    
                    {/* Face Box */}
                    <div style={{ background: "rgba(0,255,255,0.03)", border: "1px solid rgba(0,255,255,0.1)", padding: "10px 15px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ width: "36px", height: "36px", background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#00ffff" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="12" cy="10" r="3"></circle><path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path></svg>
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: "bold" }}>Facial Identity</div>
                        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.5)" }}>64-point neural map</div>
                      </div>
                      <div style={{ fontSize: "0.5rem", color: "#00ff66", fontWeight: "bold", letterSpacing: "1px" }}>VERIFIED</div>
                    </div>

                    {/* Voice Box */}
                    <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.05)", padding: "10px 15px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: "bold" }}>Voice Print</div>
                        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.5)" }}>Spectral signature</div>
                      </div>
                      <div style={{ width: "28px", height: "14px", background: "#00ffff", borderRadius: "7px", position: "relative", cursor: "pointer" }}>
                        <div style={{ width: "10px", height: "10px", background: "#050B14", borderRadius: "50%", position: "absolute", top: "2px", right: "2px" }}></div>
                      </div>
                    </div>

                    {/* Fingerprint Box */}
                    <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.05)", padding: "10px 15px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ width: "36px", height: "36px", background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#00ffff" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"></path><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"></path><path d="M8.5 22c-1.3-1.5-1.5-2.8-1.5-4.5 0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5c0 1.7-.2 3-1.5 4.5"></path><path d="M10.5 15c0 1.5 1.5 3 3 3s3-1.5 3-3-1.5-3-3-3-3 1.5-3 3z"></path></svg>
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: "bold" }}>Touch ID</div>
                        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.5)" }}>3 fingerprints enrolled</div>
                      </div>
                      <div style={{ fontSize: "0.5rem", color: "#00ff66", fontWeight: "bold", letterSpacing: "1px" }}>VERIFIED</div>
                    </div>

                    {/* Gesture Box */}
                    <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.05)", padding: "10px 15px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path><path d="M14 4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path><path d="M10 4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path><path d="M16 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path><path d="M6 14v-3a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8l3 4.5a3 3 0 0 0 2.5 1.5H16a4 4 0 0 0 4-4V12a4 4 0 0 0-4-4h-2"></path></svg>
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: "bold" }}>Gesture Signature</div>
                        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.5)" }}>12 gestures learned</div>
                      </div>
                      <div style={{ width: "28px", height: "14px", background: "#00ffff", borderRadius: "7px", position: "relative", cursor: "pointer" }}>
                        <div style={{ width: "10px", height: "10px", background: "#050B14", borderRadius: "50%", position: "absolute", top: "2px", right: "2px" }}></div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 03 Adaptive Profile */}
                <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ color: "#00ffff", fontSize: "0.8rem", fontWeight: "bold" }}>03</div>
                    <div style={{ fontSize: "1rem", fontWeight: "bold", letterSpacing: "1px" }}>Adaptive Profile</div>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.5)", padding: "15px", borderRadius: "4px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: "bold" }}>Continuous cognitive calibration</div>
                      <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.5)" }}>Allow NOVA to refine interaction patterns from your commands and routines.</div>
                    </div>
                    <div style={{ width: "28px", height: "14px", background: "rgba(255,255,255,0.1)", borderRadius: "7px", position: "relative", cursor: "pointer" }}>
                        <div style={{ width: "10px", height: "10px", background: "rgba(255,255,255,0.4)", borderRadius: "50%", position: "absolute", top: "2px", left: "2px" }}></div>
                    </div>
                  </div>
                </div>

                {/* Footer Message & Save Button */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                  <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>All profile data is stored locally on this device.</div>
                  <button className="hud-clickable" style={{ background: "#00ffff", color: "#000", border: "none", padding: "10px 20px", fontSize: "0.7rem", letterSpacing: "1px", fontWeight: "bold", borderRadius: "2px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                    SAVE CHANGES
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}`;

let startIndex = lines.findIndex(l => l.includes('=== COMMANDER PROFILES (Identity) ==='));
let endIndex = lines.findIndex((l, i) => i > startIndex && l.trim() === ')}');

if (startIndex === -1 || endIndex === -1) {
    console.error("Failed to find bounds.");
    process.exit(1);
}

lines.splice(startIndex, (endIndex - startIndex) + 1, newContent);

fs.writeFileSync('src/components/desktop/HUD/SettingsApp.tsx', lines.join('\n'));
console.log("Successfully replaced block to remove 3D models.");
