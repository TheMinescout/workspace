/* --- ROADMAP STYLES --- */
.roadmap-container {
    display: flex; gap: 20px; overflow-x: auto; padding: 20px 5px;
    font-family: 'Inter', sans-serif;
}

.roadmap-col {
    flex: 1; min-width: 280px;
    background: #f8f9fa; 
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    display: flex; flex-direction: column;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.roadmap-col h3 {
    margin-top: 0; font-size: 1.2rem; font-weight: 700;
    padding-bottom: 12px; border-bottom: 2px solid;
    display: flex; align-items: center; gap: 8px; color: #1f2937;
}

/* Header Colors */
.roadmap-col.planned h3 { border-color: #3b82f6; }
.roadmap-col.progress h3 { border-color: #f59e0b; }
.roadmap-col.done h3 { border-color: #10b981; }

/* Items */
.roadmap-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-left-width: 4px;
    padding: 12px 16px; margin-bottom: 12px;
    border-radius: 6px; 
    color: #374151; font-weight: 500;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    position: relative;
    animation: fadeIn 0.3s ease-in;
}

/* Item Borders */
.roadmap-col.planned .roadmap-card { border-left-color: #3b82f6; }
.roadmap-col.progress .roadmap-card { border-left-color: #f59e0b; }
.roadmap-col.done .roadmap-card { border-left-color: #10b981; }

.roadmap-tag {
    display: inline-block; font-size: 0.7rem; padding: 2px 8px;
    background: #f3f4f6; color: #6b7280;
    border-radius: 12px; margin-left: 8px; float: right;
    text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold;
}

/* --- ADMIN INPUTS (Hidden by default) --- */
.roadmap-input-group {
    margin-top: auto; padding-top: 15px;
    display: none; /* KEY FIX: Hides inputs until JS confirms Admin */
    flex-direction: column; gap: 10px;
}

.roadmap-input, .roadmap-tag-select {
    width: 100%; padding: 10px 12px;
    background: #ffffff; border: 1px solid #d1d5db;
    border-radius: 6px; font-size: 0.95rem; outline: none;
    box-sizing: border-box;
}
.roadmap-input:focus { border-color: #5a8a5a; box-shadow: 0 0 0 3px rgba(90, 138, 90, 0.2); }

/* Green Add Button */
.btn-add-task {
    width: 100%; padding: 10px;
    background-color: #5a8a5a; color: white;
    border: none; border-radius: 6px;
    font-weight: bold; cursor: pointer; text-transform: uppercase;
    font-size: 0.9rem; transition: 0.2s;
}
.btn-add-task:hover { background-color: #446944; }

/* Delete Button */
.btn-delete-item {
    position: absolute; top: 8px; right: 8px;
    color: #ef4444; cursor: pointer; font-weight: bold;
    display: none; /* Hidden for visitors */
}
.roadmap-card:hover .btn-delete-item { opacity: 1; }

/* --- TREE DIAGRAM --- */
.tree-wrapper { margin-top: 50px; padding: 40px; background: #fff; border: 1px solid #ddd; border-radius: 12px; text-align: center; overflow-x: auto; }
.tree-level { display: flex; justify-content: center; gap: 20px; margin-bottom: 40px; position: relative; padding-left: 30px; }
.tree-level:not(:last-child)::after { content: ''; position: absolute; bottom: -20px; left: 50%; width: 2px; height: 20px; background: #ccc; transform: translateX(-50%); }
.tree-level:not(:first-child)::before { content: ''; position: absolute; top: -10px; left: 20%; right: 20%; height: 2px; background: #ccc; display: block; z-index: 1; }
.tree-node { position: relative; padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold; min-width: 120px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 2; }
.tree-node.done { background-color: #10b981; }
.tree-node.progress { background-color: #f59e0b; }
.tree-node.planned { background-color: #3b82f6; }
.level-label { position: absolute; left: 0; top: 50%; transform: translateY(-50%); font-size: 0.7rem; font-weight: bold; color: #999; text-transform: uppercase; writing-mode: vertical-rl; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }