import React, { useState } from "react";

// ==========================================
// TYPESCRIPT BLUEPRINTS
// ==========================================
interface PullsheetItem {
  id: string;
  name: string;
  fileName: string;
}

const App = () => {
  // 1. App Data
  const inventoryGroups = [
    {
      categoryName: "Packages",
      items: [
        {
          id: "p1",
          name: "6-Hour Wedding DJ",
          fileName: "img/evergladesParisi.jpg",
        },
        { id: "p2", name: "Premium Band Audio", fileName: "/live-band.jpg" },
      ],
    },
    {
      categoryName: "Systems",
      items: [
        { id: "s1", name: "Photo Booth Kiosk", fileName: "/photo-booth.jpg" },
        { id: "s2", name: "Corporate AV System", fileName: "/corporate.jpg" },
      ],
    },
    {
      categoryName: "Itemized Pullsheets",
      subcategories: [
        {
          name: "Sound",
          items: [
            { id: "i_s1", name: "Wireless Mic Kit", fileName: "/mics.jpg" },
            { id: "i_s2", name: "Subwoofer Expansion", fileName: "/subs.jpg" },
            { id: "i_s3", name: "DJ Monitor Wedge", fileName: "/wedge.jpg" },
          ],
        },
        {
          name: "Lighting",
          items: [
            {
              id: "i_l1",
              name: "Wireless Uplighting",
              fileName: "/uplighting.jpg",
            },
            {
              id: "i_l2",
              name: "Moving Head Totems",
              fileName: "/moving-heads.jpg",
            },
          ],
        },
        {
          name: "AV",
          items: [
            {
              id: "i_a1",
              name: "Projector & Screen",
              fileName: "/projector.jpg",
            },
            {
              id: "i_a2",
              name: "Confidence Monitor",
              fileName: "/monitor.jpg",
            },
          ],
        },
        {
          name: "Miscellaneous",
          items: [
            {
              id: "i_m1",
              name: "Event Assistant Kit",
              fileName: "/assistant-kit.jpg",
            },
            { id: "i_m2", name: "Trussing & Rigging", fileName: "/truss.jpg" },
          ],
        },
      ],
    },
    {
      categoryName: "Venue Floorplans",
      items: [
        { id: "f1", name: "Standard Ballroom", fileName: "/ballroom.jpg" },
        { id: "f2", name: "Outdoor Tent Layout", fileName: "/tent.jpg" },
      ],
    },
  ];

  // 2. State Management (Now strictly typed as an array of PullsheetItems)
  const [printQueue, setPrintQueue] = useState<PullsheetItem[]>([]);

  // 3. Queue Logic (Added types to parameters)
  const addToQueue = (sheet: PullsheetItem) => {
    setPrintQueue([...printQueue, sheet]);
  };

  const removeFromQueue = (indexToRemove: number) => {
    setPrintQueue(printQueue.filter((_, index) => index !== indexToRemove));
  };

  const clearQueue = () => {
    if (window.confirm("Are you sure you want to clear the loadout?")) {
      setPrintQueue([]);
    }
  };

  // 4. PRINT LOGIC
  const handlePrintBatch = async () => {
    if (printQueue.length === 0) return alert("Select at least one sheet.");

    await Promise.all(
      printQueue.map((item) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = item.fileName;
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="app-wrapper">
      {/* =========================================
          THE UI 
          ========================================= */}
      <div className="no-print">
        <nav className="top-nav">
          <h1 className="nav-title">
            PARISI EVENTS <span className="nav-subtitle">| LOADOUT</span>
          </h1>
        </nav>

        <div className="dashboard-container">
          <section className="inventory-section">
            {inventoryGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="category-block">
                <h2 className="category-title">{group.categoryName}</h2>

                {group.subcategories ? (
                  <div className="subcategories-wrapper">
                    {group.subcategories.map((sub, subIndex) => (
                      <div key={subIndex} className="subcategory-block">
                        <h3 className="subcategory-title">{sub.name}</h3>
                        <div className="ui-grid">
                          {sub.items.map((sheet) => (
                            <div key={sheet.id} className="item-card">
                              <div className="image-wrapper">
                                <img
                                  className="thumbnail-image"
                                  src={sheet.fileName}
                                  alt={sheet.name}
                                />
                              </div>
                              <div className="card-footer">
                                <span className="item-name">{sheet.name}</span>
                                <button
                                  className="add-btn"
                                  onClick={() => addToQueue(sheet)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="ui-grid">
                    {group.items.map((sheet) => (
                      <div key={sheet.id} className="item-card">
                        <div className="image-wrapper">
                          <img
                            className="thumbnail-image"
                            src={sheet.fileName}
                            alt={sheet.name}
                          />
                        </div>
                        <div className="card-footer">
                          <span className="item-name">{sheet.name}</span>
                          <button
                            className="add-btn"
                            onClick={() => addToQueue(sheet)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>

          <aside className="sidebar-section">
            <div className="queue-panel">
              <div className="queue-header-flex">
                <h3
                  className="panel-header"
                  style={{ margin: 0, border: "none", padding: 0 }}
                >
                  Active Batch
                </h3>
                <span className="badge">{printQueue.length}</span>
              </div>

              <div className="queue-list">
                {printQueue.length === 0 ? (
                  <p className="empty-state">No pullsheets selected.</p>
                ) : (
                  printQueue.map((item, index) => (
                    <div key={index} className="queue-item">
                      <span className="queue-item-name">{item.name}</span>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromQueue(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="action-buttons">
                <button className="print-trigger" onClick={handlePrintBatch}>
                  Generate Print Batch
                </button>
                <button className="clear-trigger" onClick={clearQueue}>
                  Clear All
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* =========================================
          THE PRINT CONTAINER 
          ========================================= */}
      <div className="only-print" id="print-section-batch">
        {printQueue.map((item, index) => (
          <div key={index} className="print-page">
            <img className="print-img" src={item.fileName} alt={item.name} />
          </div>
        ))}
      </div>

      <style>{`
        /* ---------------------------------------------------
           WEB FONTS & GLOBAL STYLES 
           --------------------------------------------------- */
           
        @font-face { font-family: 'Gotham Condensed'; src: url('/fonts/gothamcondensed-bold-webfont.woff2') format('woff2'); font-weight: 400; font-style: normal; }
        @font-face { font-family: 'Gotham Condensed'; src: url('/fonts/gothamcondensed-bold-webfont.woff2') format('woff2'); font-weight: 500; font-style: normal; }
        @font-face { font-family: 'Gotham Condensed'; src: url('/fonts/gothamcondensed-bold-webfont.woff2') format('woff2'); font-weight: 600; font-style: normal; }
        @font-face { font-family: 'Gotham Condensed'; src: url('/fonts/gothamcondensed-bold-webfont.woff2') format('woff2'); font-weight: 800; font-style: normal; }

        body { margin: 0; background-color: #faf9f6; font-family: 'Gotham Condensed', sans-serif; letter-spacing: 0.5px; }
        .app-wrapper { font-family: 'Gotham Condensed', sans-serif; min-height: 100vh; color: #1a1a1a; }
        
        /* ---------------------------------------------------
           APP UI (Desktop Default)
           --------------------------------------------------- */
        .top-nav { position: sticky; top: 0; z-index: 1000; background-color: #111; padding: 25px 50px; border-bottom: 3px solid #c5a059; }
        .nav-title { font-weight: 800; color: #fff; font-size: 26px; margin: 0; letter-spacing: 2px; }
        .nav-subtitle { color: #c5a059; font-weight: 400; }

        .dashboard-container { max-width: 1500px; margin: 0 auto; padding: 50px; display: grid; grid-template-columns: 1fr 200px; gap: 40px; align-items: start; }
        
        .category-block { margin-bottom: 60px; }
        .category-title { margin-top: 0; line-height: 1.2; font-weight: 800; font-size: 28px; color: #111; border-bottom: 1px solid #dcdcdc; padding-bottom: 12px; margin-bottom: 30px; letter-spacing: 0.5px; text-transform: uppercase; }
        
        .subcategory-block { margin-bottom: 40px; }
        .subcategory-title { font-weight: 600; font-size: 18px; color: #c5a059; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 20px 0; }

        .ui-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }
        
        .item-card { 
          width: 100%; 
          box-sizing: border-box; 
          background: #fff; 
          border: 1px solid #eaeaea; 
          border-radius: 4px; 
          padding: 12px; 
          transition: all 0.3s ease; 
          box-shadow: 0 2px 5px rgba(0,0,0,0.02); 
        }

        .item-card:hover { border-color: #c5a059; transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.06); }
        
        .image-wrapper { background: #f8f8f8; padding: 10px; border-radius: 2px; margin-bottom: 12px; }
        .thumbnail-image { width: 100%; aspect-ratio: 8.5 / 11; object-fit: contain; object-position: top; }
        
        .card-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .item-name { font-size: 14px; font-weight: 600; color: #333; line-height: 1.3; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .add-btn { flex-shrink: 0; background: #111; color: #c5a059; border: none; border-radius: 2px; width: 28px; height: 28px; font-size: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
        .add-btn:hover { background: #c5a059; color: #111; }

        .sidebar-section { position: sticky; top: 120px; margin-top: 46px; }
        
        .queue-panel { background: #fff; border: 1px solid #eaeaea; border-top: 4px solid #111; padding: 20px 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
        
        .queue-header-flex { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eaeaea; padding-bottom: 15px; margin-bottom: 15px; }
        .panel-header { font-weight: 800; font-size: 18px; color: #111; margin: 0; text-transform: uppercase; }
        .badge { background: #f0f0f0; color: #555; padding: 3px 8px; border-radius: 20px; font-size: 12px; font-weight: 800; }
        
        .empty-state { color: #999; font-style: italic; font-weight: 400; font-size: 13px; margin-top: 10px; }
        .queue-list { min-height: 100px; max-height: 350px; overflow-y: auto; margin-bottom: 30px; }
        .queue-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f5f5f5; transition: background 0.2s; }
        .queue-item:hover { background: #fafafa; }
        .queue-item-name { font-size: 13px; font-weight: 500; color: #333; line-height: 1.2; padding-right: 10px; text-transform: uppercase; }
        .remove-btn { background: none; border: none; color: #999; cursor: pointer; font-size: 14px; font-weight: 800; transition: color 0.2s; padding: 0 4px; }
        .remove-btn:hover { color: #d9534f; }
        
        .action-buttons { display: flex; flex-direction: column; gap: 10px; }
        .print-trigger { background: #111; color: #c5a059; border: 1px solid #111; padding: 12px; font-family: 'Gotham Condensed', sans-serif; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: all 0.3s; border-radius: 2px; }
        .print-trigger:hover { background: #c5a059; color: #111; border-color: #c5a059; }
        .clear-trigger { background: transparent; color: #888; border: 1px solid #ddd; padding: 10px; font-family: 'Gotham Condensed', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s; border-radius: 2px; text-transform: uppercase; }
        .clear-trigger:hover { border-color: #111; color: #111; }

        /* ---------------------------------------------------
           MEDIA QUERIES (The iPad Fix)
           --------------------------------------------------- */
        @media (max-width: 1366px) {
          .dashboard-container { padding: 25px; grid-template-columns: 1fr 180px; gap: 20px; }
          .top-nav { padding: 20px 25px; }
          
          .ui-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
          
          .item-card { padding: 10px; }
          .item-name { font-size: 12px; }
          .add-btn { width: 24px; height: 24px; font-size: 16px; }
          .image-wrapper { padding: 8px; margin-bottom: 10px; }
        }

        /* ---------------------------------------------------
           NATIVE CSS PRINT ENGINE
           --------------------------------------------------- */
        
        @media screen {
          .only-print { 
            position: absolute; 
            left: -9999px; 
            top: -9999px; 
            width: 1px; 
            height: 1px; 
            overflow: hidden; 
            opacity: 0; 
            pointer-events: none;
          }
        }

        @media print {
          @page { margin: 0mm !important; size: letter portrait; }
          body, html { margin: 0 !important; padding: 0 !important; background: white !important; -webkit-print-color-adjust: exact; }
          body > *:not(#root) { display: none !important; }
          .no-print { display: none !important; }
          
          .only-print { 
            position: static !important;
            opacity: 1 !important;
            width: 100% !important; 
            height: auto !important;
            display: block !important;
          }

          .print-page {
            width: 100%;
            height: auto; 
            display: flex;
            flex-direction: column;
            align-items: center; 
            justify-content: flex-start; 
            padding-top: 2cm; 
            box-sizing: border-box;
            page-break-after: always;
            break-after: page;
            page-break-inside: avoid; 
          }

          .print-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }

          .print-img {
            max-width: 95%; 
            max-height: 23cm; 
            object-fit: contain;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
