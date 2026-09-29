const fs = require('fs');
const lines = fs.readFileSync('src/components/desktop/HUD/SettingsApp.tsx', 'utf8').split('\n');

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
              <div style={{ fontSize: "0.8rem", color: "#00ffff", borderBottom: "2px solid #00ffff", paddingBottom: "8px", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}><User size={14}/> Profile</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Neural Interface</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Security</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Permissions</div>
            </div>

            <div style={{ display: "flex", gap: "30px" }}>
              {/* Left Column: Portrait & Stats */}
              <div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "15px" }}>
                <div style={{ position: "relative", width: "100%", height: "400px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "4px", overflow: "hidden" }}>
                  <HoloBody />
                  <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", fontSize: "0.6rem", color: "#00ff66", fontWeight: "bold", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "5px", background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: "10px" }}>
                    <ShieldCheck size={12} /> IDENTITY VERIFIED
                  </div>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", padding: "5px" }}>
                  <div style={{ fontSize: "0.7rem", color: "#00ffff", fontWeight: "bold", letterSpacing: "2px" }}>PRIMARY OPERATOR</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Riyan Khan</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>COMMANDER - NOVA-01</div>
                  
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", border: "1px solid #ffaa00", color: "#ffaa00", padding: "4px 8px", borderRadius: "2px", fontSize: "0.6rem", fontWeight: "bold", letterSpacing: "1px", width: "fit-content", marginTop: "5px" }}>
                    <ShieldCheck size={12} /> OMEGA CLEARANCE
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
                       <ShieldCheck size={10} /> SYNCHRONIZED
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
                       <Lock size={10} /> END-TO-END ENCRYPTED
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    
                    {/* Face Box */}
                    <div style={{ background: "rgba(0,255,255,0.03)", border: "1px solid rgba(0,255,255,0.1)", padding: "10px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ width: "50px", height: "50px", background: "#000", border: "1px solid rgba(0,255,255,0.3)", borderRadius: "4px" }}>
                        <HoloFace />
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: "bold" }}>Facial Identity</div>
                        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.5)" }}>64-point neural map</div>
                      </div>
                      <div style={{ fontSize: "0.5rem", color: "#00ff66", fontWeight: "bold", letterSpacing: "1px" }}>VERIFIED</div>
                    </div>

                    {/* Brain Box */}
                    <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.05)", padding: "10px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ width: "50px", height: "50px", background: "#000", border: "1px solid rgba(0,255,255,0.1)", borderRadius: "4px" }}>
                        <HoloBrain />
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
                    <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.05)", padding: "10px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ width: "50px", height: "50px", background: "#000", border: "1px solid rgba(0,255,255,0.1)", borderRadius: "4px" }}>
                        <HoloFingerprint />
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: "bold" }}>Touch ID</div>
                        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.5)" }}>3 fingerprints enrolled</div>
                      </div>
                      <div style={{ fontSize: "0.5rem", color: "#00ff66", fontWeight: "bold", letterSpacing: "1px" }}>VERIFIED</div>
                    </div>

                    {/* Eye Box */}
                    <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.05)", padding: "10px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ width: "50px", height: "50px", background: "#000", border: "1px solid rgba(0,255,255,0.1)", borderRadius: "4px" }}>
                        <HoloEye />
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
                    <ShieldCheck size={14} /> SAVE CHANGES
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}`;

// Ensure we don't mess up if the code has slightly changed.
// Just find the lines that contain the marker comments.
let startIndex = lines.findIndex(l => l.includes('=== COMMANDER PROFILES (Accounts) ==='));
let endIndex = lines.findIndex((l, i) => i > startIndex && l.trim() === ')}');

if (startIndex === -1 || endIndex === -1) {
    console.error("Failed to find bounds.");
    process.exit(1);
}

// include the closing block parenthesis in the replacement
lines.splice(startIndex, (endIndex - startIndex) + 1, newContent);

fs.writeFileSync('src/components/desktop/HUD/SettingsApp.tsx', lines.join('\n'));
console.log("Successfully replaced block.");
