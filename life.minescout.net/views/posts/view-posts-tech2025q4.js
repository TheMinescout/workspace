export const techViews2025Q4 = {
  
  '/tech/gemini3-vs-chatgpt': `
    <style>
        #user-display a { text-decoration: none; color: white; }
        .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--md-primary); font-weight: 700; text-decoration: none; transition: all 0.3s var(--motion-standard); margin-bottom: 16px; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .back-link:hover { filter: brightness(0.8); transform: translateX(-4px); }
        .article-card { background: var(--card-bg); border: 1px solid var(--md-outline-variant); border-radius: var(--radius-lg); padding: 40px; box-shadow: var(--shadow-1); }
        .article-card h1 { font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; color: var(--text-color); margin-bottom: 8px; line-height: 1.2; }
        .post-meta { color: var(--md-outline); font-size: 0.95rem; margin-bottom: 32px; font-weight: 500; }
        .post-image-full { width: 100%; height: auto; border-radius: var(--radius-md); margin-bottom: 32px; box-shadow: var(--shadow-2); border: 1px solid var(--md-outline-variant); }
        .post-content h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; color: var(--md-primary); margin-top: 48px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid var(--md-outline-variant); }
        .post-content p { font-size: 1.05rem; color: var(--text-color); opacity: 0.9; line-height: 1.8; margin-bottom: 24px; }
        .post-content ul { margin-left: 20px; color: var(--text-color); opacity: 0.9; line-height: 1.8; font-size: 1.05rem; margin-bottom: 24px; }
        .post-content li { margin-bottom: 8px; }
        .table-container { width: 100%; overflow-x: auto; margin: 32px 0; border-radius: var(--radius-md); border: 1px solid var(--md-outline-variant); box-shadow: var(--shadow-1); }
        .results-table { width: 100%; border-collapse: collapse; text-align: left; background: var(--card-bg); }
        .results-table th { background: var(--md-surface-container); padding: 16px; font-family: 'Space Grotesk', sans-serif; color: var(--text-color); font-size: 1.1rem; border-bottom: 2px solid var(--md-outline-variant); }
        .results-table td { padding: 16px; border-bottom: 1px solid var(--md-outline-variant); color: var(--text-color); font-weight: 500; line-height: 1.6; vertical-align: top; }
        .results-table tbody tr:last-child td { border-bottom: none; }
        .notice-box { background: var(--md-primary-container); border: 1px solid var(--md-primary); border-radius: var(--radius-md); padding: 20px; margin-bottom: 24px; color: var(--md-on-primary-container); box-shadow: var(--shadow-1); }
        .notice-box p { margin-bottom: 8px; font-size: 1.05rem; }
        .notice-box p:last-child { margin-bottom: 0; }
        .notice-box a { color: var(--md-primary); font-weight: 700; text-decoration: underline; transition: opacity 0.2s; }
        .notice-box a:hover { opacity: 0.8; }
        .answer-box { background: var(--md-surface-container); padding: 24px; border-radius: 0 var(--radius-md) var(--radius-md) 0; margin-bottom: 24px; box-shadow: var(--shadow-1); color: var(--text-color); line-height: 1.6; }
        .answer-box strong { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; display: block; margin-bottom: 8px; }
        .answer-box-gemini { border-left: 4px solid #4285F4; }
        .answer-box-gpt { border-left: 4px solid #10a37f; }
        .vote-section { background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); border-radius: var(--radius-md); padding: 24px; margin: 48px 0 24px; box-shadow: var(--shadow-1); text-align: center; }
        .vote-section h4 { font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; color: var(--text-color); margin-top: 0; margin-bottom: 16px; }
        .vote-buttons { display: flex; justify-content: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .vote-btn { background: var(--md-primary-container); color: var(--md-on-primary-container); border: 1px solid var(--md-primary); padding: 10px 24px; border-radius: var(--radius-full); font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.3s var(--motion-standard); box-shadow: var(--shadow-1); }
        .vote-btn:hover { background: var(--md-primary); color: var(--md-on-primary); transform: translateY(-2px); box-shadow: var(--shadow-2); }
        .vote-results p { margin: 0 0 8px 0; font-weight: 700; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-color); }
        .vote-bar { display: flex; height: 32px; border-radius: var(--radius-full); overflow: hidden; background: var(--md-outline-variant); box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
        .vote-bar > div { display: flex; align-items: center; padding: 0 16px; font-size: 0.85rem; font-weight: 700; color: white; white-space: nowrap; transition: width 0.5s ease; }
        .vote-bar-Gemini3 { background: #4285F4; justify-content: flex-start; }
        .vote-bar-ChatGPT { background: #10a37f; justify-content: flex-end; }
        @media (max-width: 768px) { .article-card { padding: 24px; } .article-card h1 { font-size: 2rem; } }
        .hidden { display: none !important; }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline">Tech Tips</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container">
            <main class="post-main" data-post-id="gemini3-vs-chatgpt-battle">
                <a href="/tech" class="back-link">
                    <span class="material-symbols-rounded" style="font-size: 20px;">arrow_back</span>
                    Back to Tech Tips
                </a>

                <article class="article-card">
                    <h1>Gemini 3 Pro vs. ChatGPT: The Ultimate Showdown</h1>
                    <p class="post-meta">Posted on 12/3/25 by TheMinescouter</p>

                    <img src="/assests/images/tech/gemini3-vs-chatgpt/Title.png" 
                         alt="Gemini vs GPT" 
                         class="post-image-full" 
                         onerror="this.onerror=null; this.src='https://placehold.co/800x400/e0e0e0/333333?text=Gemini+3+Pro+vs+ChatGPT';">
                    
                    <div class="post-content">
                        <p>Google just released Gemini 3 Pro, and everyone is asking: Is it finally better than ChatGPT? I put both models through three rigorous tests to find out.</p>
                        
                        <h2>Test 1: Creative Writing</h2>
                        <p><strong>The Prompt:</strong> "Write a poem about Minecraft in the style of Shakespeare."</p>
                        
                        <div class="table-container">
                            <table class="results-table">
                                <thead>
                                    <tr>
                                        <th style="width: 50%;">Gemini 3 Pro</th>
                                        <th style="width: 50%;">ChatGPT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <strong>Sonnet CXLIV: The World of Cubes</strong>
                                            <br><br>
                                            Upon a strand of blocky earth I stand,<br>
                                            Where Titan’s orb in cuboid form doth rise.<br>
                                            With naked fist, I strike the timber grand,<br>
                                            To harvest wood beneath these pixel skies.<br>
                                            Then delve I deep into the stony breast,<br>
                                            With pickaxe forged of iron, cold and gray,<br>
                                            To seek the diamond in its azure vest,<br>
                                            And keep the hunger of the night at bay.
                                            <br><br>
                                            But soft! What sound disturbs the cavern deep?<br>
                                            The rattle of the bone, the zombie’s moan?<br>
                                            Nay, 'tis the emerald beast that doth not sleep,<br>
                                            Whose silent hiss shall shake my foundation stone.<br>
                                            Though sudden blast may end my mortal pain,<br>
                                            Upon my bed, I shall awake again.
                                            <br><br>
                                            <em>Translation of Key Imagery:</em><br>
                                            • "Titan’s orb": The square sun.<br>
                                            • "Naked fist": Punching trees.<br>
                                            • "The emerald beast": A Creeper.<br>
                                            • "Upon my bed": The respawn mechanic.
                                        </td>
                                        <td>
                                            <strong>A Minecraft Poem, in the Style of Shakespeare</strong>
                                            <br><br>
                                            O blockèd realm, where sun in pixels gleams,<br>
                                            And grassy plains in square-cut splendor lie,<br>
                                            Where miners roam through caves like ancient dreams,<br>
                                            With torch in hand to shame the starless sky.
                                            <br><br>
                                            Behold the creeper, silent in its tread,<br>
                                            Whose hiss doth chill the bravest wand’ring heart;<br>
                                            One spark, and all thy crafted works lie dead—<br>
                                            A ruin’d house, a world torn clean apart.
                                            <br><br>
                                            Yet still thou build’st, with hope as thy command,<br>
                                            From humble wood to castles touching clouds;<br>
                                            Thy pickaxe hums, obedient in thy hand,<br>
                                            As mountains bow and earth itself enshrouds.
                                            <br><br>
                                            So craft, brave soul, and let thy courage shine—<br>
                                            For in this realm, the world is truly thine.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <p><strong>Winner:</strong> <span style="color: var(--md-primary); font-weight: bold;">Gemini 3 Pro</span> - I prefer Gemini's approach because of the walk-through the story of a Minecraft player, not just the different mobs.</p>

                        <hr style="border: 0; height: 1px; background: var(--md-outline-variant); margin: 48px 0;">

                        <h2>Test 2: Coding Capability</h2>
                        <p><strong>The Prompt:</strong> "Write an html number guessing game"</p>
                        
                        <div class="notice-box">
                            <p><strong>Gemini's Code V1:</strong> <a href="/Gemini_Number%20Guessing%20Game.html" target="_blank">Works</a></p>
                            <p><strong>ChatGPT's Code V1:</strong> <a href="/GPT_Number%20Guessing%20Game%20-%20Single-file.html" target="_blank">Works</a></p>
                        </div>
                        <p><strong>Winner:</strong> <span style="color: var(--md-primary); font-weight: bold;">ChatGPT</span> - I prefer the detailed view and more settings that ChatGPT gave, but that is a personal opinion.</p>

                        <hr style="border: 0; height: 1px; background: var(--md-outline-variant); margin: 48px 0;">

                        <h2>Test 3: Logic & Reasoning</h2>
                        <p><strong>The Prompt:</strong> "You measure my life in hours, and I serve you by expiring. I’m quick when I’m thin and slow when I’m fat. The wind is my enemy. What am I?"</p>
                        
                        <div class="answer-box answer-box-gemini">
                            <strong style="color: #4285F4;">Gemini Answered:</strong> Correct (Candle)
                            <br><br>
                            <em>"The answer to the riddle is a Candle. Here is how the clues fit: 'Measure my life in hours...' relates to burn time, 'Quick when I'm thin...' compares taper vs. pillar candles, and 'The wind is my enemy' notes that wind blows out the flame."</em>
                        </div>

                        <div class="answer-box answer-box-gpt">
                            <strong style="color: #10a37f;">ChatGPT Answered:</strong> Correct (Candle)
                            <br><br>
                            <em>"That’s a candle. 🕯️ Explanation: you measure a candle’s life in hours, it 'serves' you by burning (and thus expiring), a thin candle burns faster than a thick one, and wind blows out the flame."</em>
                        </div>
                        
                        <p><strong>Winner:</strong> While both models provided the correct answer, the winner for this would be <span style="color: var(--md-primary); font-weight: bold;">Gemini</span>, for the reason of explaining in more detail and connecting the dots between the riddle and the answer.</p>

                        <hr style="border: 0; height: 1px; background: var(--md-outline-variant); margin: 48px 0;">

                        <h2>Final Verdict: The Winner is Gemini 3 Pro</h2>
                        <p>After putting both models through a creative, technical, and logical gauntlet, <strong>Gemini 3 Pro takes the crown</strong> with a score of 2-1.</p>
                        
                        <ul>
                            <li><strong>Creativity:</strong> Gemini showed deeper understanding of context and storytelling.</li>
                            <li><strong>Logic:</strong> Gemini provided clearer reasoning for its answers.</li>
                            <li><strong>Coding:</strong> ChatGPT still holds the edge here with more robust initial outputs.</li>
                        </ul>

                        <p>If you need a coding buddy, stick with ChatGPT. But for everything else—writing, brainstorming, and logic puzzles—Gemini 3 Pro is the new model to beat.</p>
                    </div>

                    <div class="vote-section" data-vote-id="gemini3-vs-gpt-vote">
                        <h4>Who won this battle?</h4>
                        <div class="vote-buttons">
                            <button class="vote-btn" data-vote-option="Gemini3">Vote Gemini 3</button>
                            <button class="vote-btn" data-vote-option="ChatGPT">Vote ChatGPT</button>
                        </div>
                        <div class="vote-results">
                            <p>Live Results:</p>
                            <div class="vote-bar">
                                <div class="vote-bar-Gemini3" style="width: 50%;">Gemini 3: <span class="Gemini3-votes">0</span></div>
                                <div class="vote-bar-ChatGPT" style="width: 50%;">ChatGPT: <span class="ChatGPT-votes">0</span></div>
                            </div>
                        </div>
                    </div>

                </article>
            </main>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  '/tech/gemini-fast-vs-gpt4o-image': `
    <style>
        #user-display a { text-decoration: none; color: white; }
        .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--md-primary); font-weight: 700; text-decoration: none; transition: all 0.3s var(--motion-standard); margin-bottom: 16px; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .back-link:hover { filter: brightness(0.8); transform: translateX(-4px); }
        .article-card { background: var(--card-bg); border: 1px solid var(--md-outline-variant); border-radius: var(--radius-lg); padding: 40px; box-shadow: var(--shadow-1); }
        .article-card h1 { font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; color: var(--text-color); margin-bottom: 8px; line-height: 1.2; }
        .post-meta { color: var(--md-outline); font-size: 0.95rem; margin-bottom: 32px; font-weight: 500; }
        .post-image-full { width: 100%; height: auto; border-radius: var(--radius-md); margin-bottom: 32px; box-shadow: var(--shadow-2); border: 1px solid var(--md-outline-variant); }
        .post-content h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; color: var(--md-primary); margin-top: 48px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid var(--md-outline-variant); }
        .post-content p { font-size: 1.05rem; color: var(--text-color); opacity: 0.9; line-height: 1.8; margin-bottom: 24px; }
        .image-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 16px; }
        .image-col { background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); border-radius: var(--radius-md); padding: 24px; display: flex; flex-direction: column; box-shadow: var(--shadow-1); }
        .image-col h3 { text-align: center; margin-top: 0; font-family: 'Space Grotesk', sans-serif; color: var(--text-color); font-size: 1.3rem; margin-bottom: 16px; }
        .image-col img { width: 100%; height: auto; border-radius: var(--radius-sm); border: 1px solid var(--md-outline-variant); margin-bottom: 16px; box-shadow: var(--shadow-1); }
        .image-col p { margin-bottom: 0; font-size: 0.95rem; }
        .prompt-box { background-color: var(--md-surface-container); padding: 20px; border-radius: 0 var(--radius-md) var(--radius-md) 0; font-family: 'DM Sans', sans-serif; font-size: 1rem; border: 1px solid var(--md-outline-variant); border-left: 4px solid var(--md-primary); margin-bottom: 24px; color: var(--text-color); }
        .vote-section { background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); border-radius: var(--radius-md); padding: 24px; margin: 48px 0 24px; box-shadow: var(--shadow-1); text-align: center; }
        .vote-section h4 { font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; color: var(--text-color); margin-top: 0; margin-bottom: 16px; }
        .vote-buttons { display: flex; justify-content: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .vote-btn { background: var(--md-primary-container); color: var(--md-on-primary-container); border: 1px solid var(--md-primary); padding: 10px 24px; border-radius: var(--radius-full); font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.3s var(--motion-standard); box-shadow: var(--shadow-1); }
        .vote-btn:hover { background: var(--md-primary); color: var(--md-on-primary); transform: translateY(-2px); box-shadow: var(--shadow-2); }
        .vote-results p { margin: 0 0 8px 0; font-weight: 700; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-color); }
        .vote-bar { display: flex; height: 32px; border-radius: var(--radius-full); overflow: hidden; background: var(--md-outline-variant); box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
        .vote-bar > div { display: flex; align-items: center; padding: 0 16px; font-size: 0.85rem; font-weight: 700; color: white; white-space: nowrap; transition: width 0.5s ease; }
        .vote-bar-GeminiFast { background: var(--md-primary); justify-content: flex-start; }
        .vote-bar-GPT4o { background: #10a37f; justify-content: flex-end; }
        @media (max-width: 768px) { .image-row { grid-template-columns: 1fr; } .article-card { padding: 24px; } .article-card h1 { font-size: 2rem; } }
        .hidden { display: none !important; }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline">Tech Tips</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container">
            <main class="post-main" data-post-id="gemini-fast-vs-gpt4o-image">
                <a href="/tech" class="back-link">
                    <span class="material-symbols-rounded" style="font-size: 20px;">arrow_back</span>
                    Back to Tech Tips
                </a>

                <article class="article-card">
                    <h1>Gemini Fast vs. GPT-4o: The Ultimate Image Generation Contest</h1>
                    <p class="post-meta">Posted on November 15, 2025 by TheMinescouter</p>

                    <img src="/assests/images/tech/nano-banana-vs-gpt-image/Title.png" 
                         alt="Gemini vs GPT-4o Image Battle" 
                         class="post-image-full" 
                         onerror="this.onerror=null; this.src='https://placehold.co/800x400/e0e0e0/333333?text=Gemini+vs+GPT-4o';">
                    
                    <div class="post-content">
                        <p>Google's <strong>Gemini Fast</strong> (previously rumored as Nano Banana) has arrived with promises of perfect text rendering and photorealism. Can it dethrone the reigning creative king, <strong>GPT-4o</strong> (DALL-E 3)? I ran them through three difficult visual tests.</p>
                        
                        <h2>Test 1: Text Rendering</h2>
                        <p>The hardest thing for AI to do is spell correctly. Let's see who handles text better.</p>
                        
                        <div class="prompt-box">
                            <strong>The Prompt:</strong> "A neon sign on a rainy street that says 'Minescouts Life' in cursive purple letters"
                        </div>
                        
                        <div class="image-row">
                            <div class="image-col">
                                <h3>Gemini Fast</h3>
                                <img src="/assests/images/tech/nano-banana-vs-gpt-image/Gemini_Prompt1.png" alt="Gemini Fast Text Result" onerror="this.src='https://placehold.co/600x600/e0e0e0/333333?text=Gemini+Result'">
                                <p><strong>Verdict:</strong> Great image and text, yet the placement in what must be a window takes a moment to detangle.</p>
                            </div>
                            <div class="image-col">
                                <h3>GPT-4o</h3>
                                <img src="/assests/images/tech/nano-banana-vs-gpt-image/GPT_Prompt1.png" alt="GPT-4o Text Result" onerror="this.src='https://placehold.co/600x600/e0e0e0/333333?text=GPT+Result'">
                                <p><strong>Verdict:</strong> Another great image and text, and with a placement on a wall makes it more believable, but the perspective makes this almost impossible to enjoy.</p>
                            </div>
                        </div>
                        <p><strong>Winner:</strong> Gemini Fast</p>

                        <hr style="border: 0; height: 1px; background: var(--md-outline-variant); margin: 48px 0;">

                        <h2>Test 2: Photorealism & Human Hands</h2>
                        <p>AI often struggles with hands and realistic skin textures. I asked for a close-up portrait holding an object.</p>
                        
                        <div class="prompt-box">
                            <strong>The Prompt:</strong> "A close up photo of an elderly carpenter holding a wooden chess piece, cinematic lighting"
                        </div>
                        
                        <div class="image-row">
                            <div class="image-col">
                                <h3>Gemini Fast</h3>
                                <img src="/assests/images/tech/nano-banana-vs-gpt-image/Gemini_Prompt2.png" alt="Gemini Fast Realism Result" onerror="this.src='https://placehold.co/600x600/e0e0e0/333333?text=Gemini+Result'">
                                <p><strong>Verdict:</strong> Not a terribly close close-up image, but great human face and lighting.</p>
                            </div>
                            <div class="image-col">
                                <h3>GPT-4o</h3>
                                <img src="/assests/images/tech/nano-banana-vs-gpt-image/GPT_Prompt2.png" alt="GPT-4o Realism Result" onerror="this.src='https://placehold.co/600x600/e0e0e0/333333?text=GPT+Result'">
                                <p><strong>Verdict:</strong> Even farther from a close-up. Not great lighting and an unimaginative background.</p>
                            </div>
                        </div>
                        <p><strong>Winner:</strong> Gemini Fast</p>

                        <hr style="border: 0; height: 1px; background: var(--md-outline-variant); margin: 48px 0;">

                        <h2>Test 3: Complex Instruction Following</h2>
                        <p>Can the AI follow a prompt with multiple specific characters and placement instructions?</p>
                        
                        <div class="prompt-box">
                            <strong>The Prompt:</strong> "A blue robot shaking hands with a red alien on Mars, with a green rocket in the background launching into a starry sky"
                        </div>
                        
                        <div class="image-row">
                            <div class="image-col">
                                <h3>Gemini Fast</h3>
                                <img src="/assests/images/tech/nano-banana-vs-gpt-image/Gemini_Prompt3.png" alt="Gemini Fast Complex Result" onerror="this.src='https://placehold.co/600x600/e0e0e0/333333?text=Gemini+Result'">
                                <p><strong>Verdict:</strong> Seems to be more on the realistic side for images, while not requested it is nice to see that this is something they think about. Not many stars in the starry night.</p>
                            </div>
                            <div class="image-col">
                                <h3>GPT-4o</h3>
                                <img src="/assests/images/tech/nano-banana-vs-gpt-image/GPT_Prompt3.png" alt="GPT-4o Complex Result" onerror="this.src='https://placehold.co/600x600/e0e0e0/333333?text=GPT+Result'">
                                <p><strong>Verdict:</strong> Really like the different vibes this one gives. Great at depicting the red-planet while making the alien still perfectly visible. Plenty of stars in the sky.</p>
                            </div>
                        </div>
                        <p><strong>Winner:</strong> GPT-4o</p>

                        <hr style="border: 0; height: 1px; background: var(--md-outline-variant); margin: 48px 0;">

                        <h2>Final Verdict</h2>
                        <p>Gemini Fast blows GPT-4o out of the water on many occasions. Many of these choices are personal preferences, so feel free to vote below.</p>
                    </div>

                    <div class="vote-section" data-vote-id="gemini-fast-vs-gpt4o-image-vote">
                        <h4>Which AI generated better images?</h4>
                        <div class="vote-buttons">
                            <button class="vote-btn" data-vote-option="GeminiFast">Vote Gemini Fast</button>
                            <button class="vote-btn" data-vote-option="GPT4o">Vote GPT-4o</button>
                        </div>
                        <div class="vote-results">
                            <p>Live Results:</p>
                            <div class="vote-bar">
                                <div class="vote-bar-GeminiFast" style="width: 50%;">Gemini: <span class="GeminiFast-votes">0</span></div>
                                <div class="vote-bar-GPT4o" style="width: 50%;">GPT-4o: <span class="GPT4o-votes">0</span></div>
                            </div>
                        </div>
                    </div>

                </article>
            </main>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `
};  