// views/view-posts-puppies.js — Puppy Life Views

export const puppyViews = {
  
  '/puppy/monty': `
    <style>
        #user-display a { text-decoration: none; color: white; }
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--md-primary);
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s var(--motion-standard);
            margin-bottom: 16px;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .back-link:hover {
            filter: brightness(0.8);
            transform: translateX(-4px);
        }
        .article-card {
            background: var(--card-bg);
            border: 1px solid var(--md-outline-variant);
            border-radius: var(--radius-lg);
            padding: 40px;
            box-shadow: var(--shadow-1);
        }
        .article-card h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 2.5rem;
            color: var(--text-color);
            margin-bottom: 8px;
            line-height: 1.2;
        }
        .post-meta {
            color: var(--md-outline);
            font-size: 0.95rem;
            margin-bottom: 32px;
            font-weight: 500;
        }
        .post-image-full {
            width: 100%;
            height: auto;
            border-radius: var(--radius-md);
            margin-bottom: 32px;
            box-shadow: var(--shadow-2);
            border: 1px solid var(--md-outline-variant);
        }
        .post-content h2 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.8rem;
            color: var(--md-primary);
            margin-top: 48px;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid var(--md-outline-variant);
        }
        .post-content p {
            font-size: 1.05rem;
            color: var(--text-color);
            opacity: 0.9;
            line-height: 1.8;
            margin-bottom: 24px;
        }
        .ai-card { 
            background: var(--md-surface-container);
            border: 1px solid var(--md-outline-variant); 
            border-radius: var(--radius-md); 
            padding: 24px; 
            margin-bottom: 24px; 
            box-shadow: var(--shadow-1); 
            transition: all 0.3s var(--motion-standard);
        }
        .ai-card:hover {
            box-shadow: var(--shadow-2);
            border-color: var(--md-primary);
            transform: translateY(-2px);
        }
        .ai-card h3 { 
            margin-top: 0; 
            color: var(--text-color); 
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.3rem;
            margin-bottom: 12px;
        }
        .rating-box { 
            font-family: 'DM Sans', sans-serif;
            font-weight: 700; 
            color: var(--md-primary); 
            margin-bottom: 12px;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .review-text { 
            background-color: var(--md-primary-container); 
            border-left: 4px solid var(--md-primary); 
            padding: 16px 20px; 
            margin-top: 12px; 
            color: var(--md-on-primary-container); 
            line-height: 1.6; 
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
            font-size: 0.95rem;
        }
        .ai-note { 
            font-style: italic; 
            color: var(--md-outline); 
            font-size: 0.85rem; 
            margin-top: 48px; 
            text-align: center;
            padding: 16px;
            border-top: 1px solid var(--md-outline-variant);
        }
        @media (max-width: 768px) {
            .article-card { padding: 24px; }
            .article-card h1 { font-size: 2rem; }
            .ai-card { padding: 20px; }
        }
        .hidden { display: none !important; }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline">Puppy Life</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container">
            <main class="post-main" data-post-id="montys-life">
                <a href="/puppy-life" class="back-link">
                    <span class="material-symbols-rounded" style="font-size: 20px;">arrow_back</span>
                    Back to Puppy Life
                </a>

                <article class="article-card">
                    <h1>The Resilience of Monty: A Documentary Journey</h1>
                    <p class="post-meta">Posted on 2/17/26 by Carleton Siblings</p>

                    <img src="/assests/images/puppy-life/Monty-Life-Homepage.png" 
                         alt="Monty the dog sitting comfortably" 
                         class="post-image-full"
                         onerror="this.onerror=null; this.src='https://placehold.co/800x400/e0e0e0/333333?text=Monty+Documentary';">
                    
                    <div class="post-content">
                        <p>In the quiet corners of the Carleton home, a survivor reigns supreme. Monty, a dog who has faced the trials of a "rough patch" in 2022, has emerged not just as a pet, but as a legend of domestic resilience. This is the story of his recovery, his specialized lifestyle, and the chaotic companion that helped him find his spark again.</p>
                        
                        <h2>The 2022 Pivot</h2>
                        <p>Every documentary has a turning point. For Monty, it was 2022. While the details of the slump are his own, the effects were visible to all. It was a year of transition, requiring a new approach to his health and his happiness. This era marked the beginning of his strict medical diet—no meat, no dairy—transforming him into the healthy, disciplined figure he is today.</p>

                        <h2>The Nigel Intervention</h2>
                        <p>The turning point in Monty’s documentary arc was the arrival of Nigel. The two have established a high-energy ritual that keeps the neighbors talking: the "Yard Wars." This daily display of grappling and chasing in the backyard is the primary source of Monty's cardio, ensuring the senior dog stays agile.</p>

                        <hr style="border: 0; height: 1px; background: var(--md-outline-variant); margin: 32px 0;">

                        <h2>Puppy Review: The Monty Files</h2>

                        <div class="ai-card">
                            <h3>The Specialized Diet</h3>
                            <div class="rating-box">Rating: 10/10 (The Ultimate Good Boy)</div>
                            <div class="review-text">
                                <strong>Observations:</strong> Despite the lack of meat and dairy, Monty treats his medical food like a Michelin-star meal. His dedication to his health is statistically significant.
                            </div>
                        </div>

                        <div class="ai-card">
                            <h3>The Command Center: The Couch</h3>
                            <div class="rating-box">Rating: Infinite Comfort</div>
                            <div class="review-text">
                                <strong>Observations:</strong> If Monty is not in the yard, he is on the couch. It is his primary base of operations, his sanctuary, and his favorite place to judge the household's activities.
                            </div>
                        </div>

                        <div class="ai-card">
                            <h3>The Arch-Nemesis: Waking Up</h3>
                            <div class="rating-box">Rating: -5/10 (Would Not Recommend)</div>
                            <div class="review-text">
                                <strong>Observations:</strong> While the yard fights are exhilarating, the transition from sleep to consciousness remains Monty's greatest struggle. The act of waking up is officially the villain of his story.
                            </div>
                        </div>

                        <div class="ai-card">
                            <h3>Overall Quality of Life</h3>
                            <div class="rating-box">Current Rating: 11/10</div>
                            <div class="review-text">
                                <strong>Verdict:</strong> Since the 2022 slump, Monty has broken the scale. With a couch to call his own, a medical diet he loves, and a brother to fight in the grass, Monty is living his best life.
                            </div>
                        </div>

                    </div>

                    <p class="ai-note">Note: This article was written with the assistance of AI, based on interviews with the Carleton Siblings.</p>
                </article>
            </main>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container text-center"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `,

  '/puppy/nigel': `
    <style>
        #user-display a { text-decoration: none; color: white; }
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--md-primary);
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s var(--motion-standard);
            margin-bottom: 16px;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .back-link:hover {
            filter: brightness(0.8);
            transform: translateX(-4px);
        }
        .article-card {
            background: var(--card-bg);
            border: 1px solid var(--md-outline-variant);
            border-radius: var(--radius-lg);
            padding: 40px;
            box-shadow: var(--shadow-1);
        }
        .article-card h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 2.5rem;
            color: var(--text-color);
            margin-bottom: 8px;
            line-height: 1.2;
        }
        .post-meta {
            color: var(--md-outline);
            font-size: 0.95rem;
            margin-bottom: 32px;
            font-weight: 500;
        }
        .post-image-full {
            width: 100%;
            height: auto;
            border-radius: var(--radius-md);
            margin-bottom: 32px;
            box-shadow: var(--shadow-2);
            border: 1px solid var(--md-outline-variant);
        }
        .post-content h2 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.8rem;
            color: var(--md-primary);
            margin-top: 48px;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid var(--md-outline-variant);
        }
        .post-content p {
            font-size: 1.05rem;
            color: var(--text-color);
            opacity: 0.9;
            line-height: 1.8;
            margin-bottom: 24px;
        }
        .ai-card { 
            background: var(--md-surface-container);
            border: 1px solid var(--md-outline-variant); 
            border-radius: var(--radius-md); 
            padding: 24px; 
            margin-bottom: 24px; 
            box-shadow: var(--shadow-1); 
            transition: all 0.3s var(--motion-standard);
        }
        .ai-card:hover {
            box-shadow: var(--shadow-2);
            border-color: var(--md-primary);
            transform: translateY(-2px);
        }
        .ai-card h3 { 
            margin-top: 0; 
            color: var(--text-color); 
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.3rem;
            margin-bottom: 12px;
        }
        .rating-box { 
            font-family: 'DM Sans', sans-serif;
            font-weight: 700; 
            color: var(--md-primary); 
            margin-bottom: 12px;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .review-text { 
            background-color: var(--md-primary-container); 
            border-left: 4px solid var(--md-primary); 
            padding: 16px 20px; 
            margin-top: 12px; 
            color: var(--md-on-primary-container); 
            line-height: 1.6; 
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
            font-size: 0.95rem;
        }
        .ai-note { 
            font-style: italic; 
            color: var(--md-outline); 
            font-size: 0.85rem; 
            margin-top: 48px; 
            text-align: center;
            padding: 16px;
            border-top: 1px solid var(--md-outline-variant);
        }
        @media (max-width: 768px) {
            .article-card { padding: 24px; }
            .article-card h1 { font-size: 2rem; }
            .ai-card { padding: 20px; }
        }
        .hidden { display: none !important; }
    </style>

    <header class="main-header">
        <div class="container site-title-container">
            <div class="site-title-wrapper">
                <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                <p class="tagline">Puppy Life</p>
            </div>
        </div>
    </header>

    <div class="main-content-area">
        <div class="container">
            <main class="post-main" data-post-id="nigels-life">
                <a href="/puppy-life" class="back-link">
                    <span class="material-symbols-rounded" style="font-size: 20px;">arrow_back</span>
                    Back to Puppy Life
                </a>

                <article class="article-card">
                    <h1>Nigel: The Agent of Chaos</h1>
                    <p class="post-meta">Posted on 2/17/26 by Carleton Siblings</p>

                    <img src="/assests/images/puppy-life/Nigel-Life-Hompage.png" 
                         alt="Nigel the dog in action" 
                         class="post-image-full"
                         onerror="this.onerror=null; this.src='https://placehold.co/800x400/e0e0e0/333333?text=Nigel+Documentary';">
                    
                    <div class="post-content">
                        <p>If Monty is the stoic veteran of the Carleton household, Nigel is the high-energy recruit who disrupted everything. Entering the scene in 2022, Nigel didn't just walk into the house—he launched what experts call a "hostile takeover" attempt. However, the incumbent power, Monty, held his ground, leading to a decade-defining power struggle that eventually settled into a playful brotherhood.</p>
                        
                        <h2>The Perpetual Puppy</h2>
                        <p>Even though it has been three years since his arrival, Nigel has defied the laws of canine aging. He maintains a "perpetual puppy" energy level that keeps the household on its toes. Recently, Nigel has expanded his horizons beyond the living room, enrolling in training and social play groups to channel his boundless enthusiasm into more "productive" chaos.</p>

                        <h2>Shared Solidarity</h2>
                        <p>In a show of pack solidarity, Nigel follows the same dietary restrictions as Monty. Whether out of necessity or simply wanting to match his big brother, Nigel is fueled by the same specialized medical food, proving that you don't need meat or dairy to maintain a 24/7 zoomie schedule.</p>

                        <hr style="border: 0; height: 1px; background: var(--md-outline-variant); margin: 32px 0;">

                        <h2>Puppy Review: The Nigel Files</h2>

                        <div class="ai-card">
                            <h3>The Territory: The Yard</h3>
                            <div class="rating-box">Rating: 10/10 (Spacious)</div>
                            <div class="review-text">
                                <strong>Nigel's Review:</strong><br>
                                "The outdoor arena is magnificent. High-speed running lanes, plenty of acoustics for barking at nothing, and soft grass for tactical rolls. It is the perfect place to ambush Monty."
                            </div>
                        </div>

                        <div class="ai-card">
                            <h3>The Hobby: Annoying Monty</h3>
                            <div class="rating-box">Rating: 7/10</div>
                            <div class="review-text">
                                <strong>Observations:</strong><br>
                                Nigel finds great satisfaction in pestering his elder, though he has learned to respect the 'couch boundary' (mostly). It is a consistent 7/10 on the fun scale, only losing points when Monty actually barks back.
                            </div>
                        </div>

                        <div class="ai-card">
                            <h3>The Training Evolution</h3>
                            <div class="rating-box">Status: Work in Progress</div>
                            <div class="review-text">
                                <strong>Documentary Note:</strong><br>
                                Nigel’s recent entry into play groups suggests a new chapter. He is learning that other dogs exist besides Monty, though none provide quite the same level of wrestling competition as the original pack leader.
                            </div>
                        </div>

                    </div>

                    <p class="ai-note">Note: This article was written with the assistance of AI, based on interviews with the Carleton Siblings.</p>
                </article>
            </main>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container text-center"><p id="copyright">© 2026 Minescouts Life. All rights reserved.</p></div>
    </footer>
  `
};