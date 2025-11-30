// scorecard-main.js

const { getFirestore, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, serverTimestamp } = window.firebase;

let currentView = 'start';
let currentGame = null; 
let savedGamesData = []; 

const views = {
    start: document.getElementById('startScreen'),
    newOptions: document.getElementById('newGameOptionsScreen'),
    standardSetup: document.getElementById('standardSetupScreen'),
    customSetup: document.getElementById('customSetupScreen'),
    gameBoard: document.getElementById('gameBoardScreen'),
    savedGames: document.getElementById('savedGamesScreen')
};

const savedGamesBtn = document.getElementById('savedGamesBtn');
const newGameBtn = document.getElementById('newGameBtn');
const backToMainHomeBtn = document.getElementById('backToMainHomeBtn');
const selectStandardBtn = document.getElementById('selectStandardBtn');
const selectCustomBtn = document.getElementById('selectCustomBtn');
const backFromNewOptionsBtn = document.getElementById('backFromNewOptionsBtn');
const numPlayersStandardInput = document.getElementById('numPlayersStandard');
const playerNamesStandardContainer = document.getElementById('playerNamesStandardContainer');
const backFromStandardSetupBtn = document.getElementById('backFromStandardSetupBtn');
const startGameStandardBtn = document.getElementById('startGameStandardBtn');
const numPlayersCustomInput = document.getElementById('numPlayersCustom');
const playerNamesCustomContainer = document.getElementById('playerNamesCustomContainer');
const numRoundsCustomInput = document.getElementById('numRoundsCustom');
const showTotalColumnCheckbox = document.getElementById('showTotalColumnCheckbox');
const showTotalAtEndCheckbox = document.getElementById('showTotalAtEndCheckbox');
const backFromCustomSetupBtn = document.getElementById('backFromCustomSetupBtn');
const startGameCustomBtn = document.getElementById('startGameCustomBtn');
const gameNameInput = document.getElementById('gameNameInput');
const saveGameBtn = document.getElementById('saveGameBtn');
const backToHomeFromGameBtn = document.getElementById('backToHomeFromGameBtn');
const scoreTable = document.getElementById('scoreTable');
const scoreTableHeaderRow = document.getElementById('scoreTableHeaderRow');
const scoreTableBody = document.getElementById('scoreTableBody');
const addNewRoundBtn = document.getElementById('addNewRoundBtn');
const grandTotalAtEndDisplay = document.getElementById('grandTotalAtEndDisplay');
const savedGamesListContainer = document.getElementById('savedGamesListContainer');
const noSavedGamesMessage = document.getElementById('noSavedGamesMessage');
const savedGamesList = document.getElementById('savedGamesList');
const backToHomeFromSavedBtn = document.getElementById('backToHomeFromSavedBtn');
const userIdDisplay = document.getElementById('userIdDisplay');
const currentUserIdSpan = document.getElementById('currentUserIdSpan');
const customModal = document.getElementById('customModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalInput = document.getElementById('modalInput');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');

function showModal(title, message, onConfirm, onCancel = () => {}, showCancel = false, showInput = false, inputValue = '') {
    modalTitle.textContent = title;
    modalMessage.textContent = message;

    if (showInput) {
        modalInput.value = inputValue;
        modalInput.classList.remove('hidden');
        modalMessage.classList.add('hidden');
    } else {
        modalInput.classList.add('hidden');
        modalMessage.classList.remove('hidden');
    }

    modalConfirmBtn.onclick = () => {
        hideModal();
        onConfirm(showInput ? modalInput.value : undefined);
    };

    if (showCancel) {
        modalCancelBtn.classList.remove('hidden');
        modalCancelBtn.onclick = () => {
            hideModal();
            onCancel();
        };
    } else {
        modalCancelBtn.classList.add('hidden');
    }
    customModal.classList.remove('hidden');
}

function hideModal() {
    customModal.classList.add('hidden');
}

function showView(viewName) {
    Object.values(views).forEach(view => view.classList.remove('active'));
    views[viewName].classList.add('active');
    currentView = viewName;

    if (viewName === 'savedGames' && window.currentUserId) {
        currentUserIdSpan.textContent = window.currentUserId;
        userIdDisplay.classList.remove('hidden');
    } else {
        userIdDisplay.classList.add('hidden');
    }
}

function renderPlayerNameInputs(container, numPlayers, playerNames, onChange) {
    container.innerHTML = '<h3 class="text-gray-700 text-lg font-medium">Player Names:</h3>';
    for (let i = 0; i < numPlayers; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Player ${i + 1} Name`;
        input.value = playerNames[i] || `Player ${i + 1}`;
        input.className = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg';
        input.dataset.index = i;
        input.addEventListener('input', (e) => onChange(parseInt(e.target.dataset.index), e.target.value));
        container.appendChild(input);
    }
}

function renderGameBoard(game) {
    gameNameInput.value = game.name;
    scoreTableHeaderRow.innerHTML = '';
    scoreTableBody.innerHTML = '';
    grandTotalAtEndDisplay.classList.add('hidden');

    const thRound = document.createElement('th');
    thRound.scope = 'col';
    thRound.className = 'px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24';
    thRound.innerHTML = `<div class="flex items-center"><span class="rename-clickable" data-key="Round">${game.customColumnNames.Round || 'Round'}</span></div>`;
    thRound.querySelector('.rename-clickable').addEventListener('click', (e) => handleRenameColumn('Round', e.target.textContent));
    scoreTableHeaderRow.appendChild(thRound);

    game.playerNames.forEach((playerName, pIndex) => {
        const thPlayer = document.createElement('th');
        thPlayer.scope = 'col';
        thPlayer.className = 'px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]';
        thPlayer.innerHTML = `<div class="flex items-center"><span class="rename-clickable" data-key="P${pIndex}">${game.customColumnNames[`P${pIndex}`] || playerName}</span></div>`;
        thPlayer.querySelector('.rename-clickable').addEventListener('click', (e) => handleRenameColumn(`P${pIndex}`, e.target.textContent));
        scoreTableHeaderRow.appendChild(thPlayer);
    });

    if (game.showTotalColumn) {
        const thTotal = document.createElement('th');
        thTotal.scope = 'col';
        thTotal.className = 'px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24';
        thTotal.innerHTML = `<div class="flex items-center"><span class="rename-clickable" data-key="Total">${game.customColumnNames.Total || 'Total'}</span></div>`;
        thTotal.querySelector('.rename-clickable').addEventListener('click', (e) => handleRenameColumn('Total', e.target.textContent));
        scoreTableHeaderRow.appendChild(thTotal);
    }

    const thActions = document.createElement('th');
    thActions.scope = 'col';
    thActions.className = 'px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16';
    thActions.textContent = 'Actions';
    scoreTableHeaderRow.appendChild(thActions);

    game.roundScores.forEach((round, rIndex) => {
        renderScoreRow(round, rIndex, game);
    });

    const showQuestionMarkRow = game.numRounds === null || game.roundScores.length < game.numRounds;
    if (showQuestionMarkRow) {
        renderScoreRow(Array(game.playerNames.length).fill(null), game.roundScores.length, game, true);
    }

    renderTotalRow(game);

    if (game.type === 'custom' && !game.showTotalColumn && game.showTotalAtEnd) {
        grandTotalAtEndDisplay.classList.remove('hidden');
        const playerTotals = game.playerNames.map((_, pIndex) => game.roundScores.reduce((sum, round) => sum + (round[pIndex] || 0), 0));
        const grandTotal = playerTotals.reduce((sum, total) => sum + total, 0);
        grandTotalAtEndDisplay.textContent = `Grand Total (Sum of all player totals): ${grandTotal}`;
    }
}

function renderScoreRow(roundScores, rIndex, game, isQuestionMarkRow = false) {
    const tr = document.createElement('tr');
    tr.dataset.roundIndex = rIndex;
    const tdRoundNum = document.createElement('td');
    tdRoundNum.className = `px-6 py-4 whitespace-nowrap text-sm font-medium ${isQuestionMarkRow ? 'text-gray-400' : 'text-gray-900'}`;
    tdRoundNum.innerHTML = `<div class="flex items-center"><span class="rename-clickable" data-key="R${rIndex}">${isQuestionMarkRow ? (game.customRowNames[`R${rIndex}`] || '?') : (game.customRowNames[`R${rIndex}`] || (rIndex + 1))}</span></div>`;
    tdRoundNum.querySelector('.rename-clickable').addEventListener('click', (e) => handleRenameRow(`R${rIndex}`, e.target.textContent));
    tr.appendChild(tdRoundNum);
    game.playerNames.forEach((_, pIndex) => {
        const tdScore = document.createElement('td');
        tdScore.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
        const input = document.createElement('input');
        input.type = 'number';
        input.value = roundScores[pIndex] !== null ? roundScores[pIndex] : '';
        input.className = 'w-full border border-gray-300 rounded-md px-2 py-1 text-center focus:ring-blue-500 focus:border-blue-500';
        input.dataset.roundIndex = rIndex;
        input.dataset.playerIndex = pIndex;
        input.addEventListener('input', (e) => handleScoreChange(parseInt(e.target.dataset.roundIndex), parseInt(e.target.dataset.playerIndex), e.target.value));
        input.addEventListener('keydown', (e) => handleKeyDown(e, parseInt(e.target.dataset.roundIndex), parseInt(e.target.dataset.playerIndex), game.playerNames.length));
        tdScore.appendChild(input);
        tr.appendChild(tdScore);
    });
    if (game.showTotalColumn) {
        const tdRoundTotal = document.createElement('td');
        tdRoundTotal.className = `px-6 py-4 whitespace-nowrap text-sm ${isQuestionMarkRow ? 'text-gray-400' : 'text-gray-900 font-bold'}`;
        const roundSum = roundScores.reduce((sum, score) => sum + (score || 0), 0);
        tdRoundTotal.textContent = isQuestionMarkRow ? '-' : roundSum;
        tr.appendChild(tdRoundTotal);
    }
    const tdActions = document.createElement('td');
    tdActions.className = 'px-6 py-4 whitespace-nowrap text-right text-sm font-medium';
    if (!isQuestionMarkRow) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-button';
        deleteBtn.innerHTML = '×';
        deleteBtn.title = 'Delete Round';
        deleteBtn.dataset.roundIndex = rIndex;
        deleteBtn.addEventListener('click', (e) => handleDeleteRound(parseInt(e.target.dataset.roundIndex)));
        tdActions.appendChild(deleteBtn);
    }
    tr.appendChild(tdActions);
    if (isQuestionMarkRow) {
        scoreTableBody.appendChild(tr);
    } else {
        const questionMarkRow = scoreTableBody.querySelector(`tr[data-round-index="${game.roundScores.length}"]`);
        const totalRow = scoreTableBody.querySelector('.total-row');
        if (questionMarkRow) {
            scoreTableBody.insertBefore(tr, questionMarkRow);
        } else if (totalRow) {
            scoreTableBody.insertBefore(tr, totalRow);
        } else {
            scoreTableBody.appendChild(tr);
        }
    }
}

function renderTotalRow(game) {
    const trTotal = document.createElement('tr');
    trTotal.className = 'total-row';
    const tdTotalLabel = document.createElement('td');
    tdTotalLabel.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
    tdTotalLabel.innerHTML = `<div class="flex items-center"><span class="rename-clickable" data-key="TotalRow">${game.customRowNames.TotalRow || 'Total'}</span></div>`;
    tdTotalLabel.querySelector('.rename-clickable').addEventListener('click', (e) => handleRenameRow('TotalRow', e.target.textContent));
    trTotal.appendChild(tdTotalLabel);
    const playerTotals = game.playerNames.map((_, pIndex) => game.roundScores.reduce((sum, round) => sum + (round[pIndex] || 0), 0));
    playerTotals.forEach(total => {
        const tdPlayerTotal = document.createElement('td');
        tdPlayerTotal.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
        tdPlayerTotal.textContent = total;
        trTotal.appendChild(tdPlayerTotal);
    });
    if (game.showTotalColumn) {
        const tdGrandTotal = document.createElement('td');
        tdGrandTotal.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
        tdGrandTotal.textContent = playerTotals.reduce((sum, total) => sum + total, 0);
        trTotal.appendChild(tdGrandTotal);
    }
    const tdEmpty = document.createElement('td');
    tdEmpty.className = 'px-6 py-4 whitespace-nowrap text-right text-sm font-medium';
    trTotal.appendChild(tdEmpty);
    scoreTableBody.appendChild(trTotal);
}

function handleScoreChange(roundIndex, playerIndex, value) {
    const newScores = JSON.parse(JSON.stringify(currentGame.roundScores));
    const isQuestionMarkRowEntry = roundIndex === newScores.length;
    if (isQuestionMarkRowEntry) {
        newScores.push(Array(currentGame.playerNames.length).fill(0));
    }
    newScores[roundIndex][playerIndex] = parseInt(value) || 0;
    currentGame.roundScores = newScores;
    renderGameBoard(currentGame);
}

function handleKeyDown(e, roundIndex, playerIndex, numPlayers) {
    if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        let targetInput = null;
        const nextPlayerInRow = playerIndex + 1;
        const nextRound = roundIndex + 1;
        if (nextPlayerInRow < numPlayers) {
            targetInput = scoreTableBody.querySelector(`tr[data-round-index="${roundIndex}"] input[data-player-index="${nextPlayerInRow}"]`);
        } else {
            const isLastExistingRound = roundIndex === currentGame.roundScores.length - 1;
            const hasMoreRoundsAllowed = currentGame.numRounds === null || currentGame.roundScores.length < currentGame.numRounds;
            if (isLastExistingRound && hasMoreRoundsAllowed) {
                targetInput = scoreTableBody.querySelector(`tr[data-round-index="${nextRound}"] input[data-player-index="0"]`);
            } else if (nextRound < currentGame.roundScores.length) {
                targetInput = scoreTableBody.querySelector(`tr[data-round-index="${nextRound}"] input[data-player-index="0"]`);
            }
        }
        if (targetInput) {
            targetInput.focus();
        } else {
            e.target.blur();
        }
    }
}

function handleRenameColumn(key, currentName) {
    showModal('Rename Column', '', (newName) => {
        if (newName && newName.trim() !== '') {
            currentGame.customColumnNames[key] = newName.trim();
            renderGameBoard(currentGame);
        } else {
            showModal('Invalid Name', 'Column name cannot be empty.', () => {});
        }
    }, () => {}, true, true, currentName);
}

function handleRenameRow(key, currentName) {
    showModal('Rename Row', '', (newName) => {
        if (newName && newName.trim() !== '') {
            currentGame.customRowNames[key] = newName.trim();
            renderGameBoard(currentGame);
        } else {
            showModal('Invalid Name', 'Row name cannot be empty.', () => {});
        }
    }, () => {}, true, true, currentName);
}

function handleDeleteRound(roundIndex) {
    showModal('Delete Round?', 'Are you sure you want to delete this round? This action cannot be undone.', () => {
        currentGame.roundScores.splice(roundIndex, 1);
        const newCustomRowNames = {};
        for (const rKey in currentGame.customRowNames) {
            if (rKey.startsWith('R')) {
                const idx = parseInt(rKey.substring(1));
                if (idx < roundIndex) {
                    newCustomRowNames[rKey] = currentGame.customRowNames[rKey];
                } else if (idx > roundIndex) {
                    newCustomRowNames[`R${idx - 1}`] = currentGame.customRowNames[rKey];
                }
            } else {
                newCustomRowNames[rKey] = currentGame.customRowNames[rKey];
            }
        }
        currentGame.customRowNames = newCustomRowNames;
        renderGameBoard(currentGame);
    }, () => {}, true);
}

function handleAddRound() {
    const currentNumRounds = currentGame.roundScores.length;
    if (currentGame.numRounds === null || currentNumRounds < currentGame.numRounds) {
        currentGame.roundScores.push(Array(currentGame.playerNames.length).fill(0));
        renderGameBoard(currentGame);
        setTimeout(() => {
            const firstInputOfNewRound = scoreTableBody.querySelector(`tr[data-round-index="${currentNumRounds}"] input[data-player-index="0"]`);
            if (firstInputOfNewRound) {
                firstInputOfNewRound.focus();
            }
        }, 0);
    } else {
        showModal('Cannot Add Round', currentGame.numRounds !== null ? `This game is limited to ${currentGame.numRounds} rounds.` : "You've reached the maximum number of rounds for this game.", () => {});
    }
}

async function saveGame() {
    if (!window.db || !window.currentUserId) {
        showModal("Save Error", "Firebase not initialized or user not authenticated. Cannot save game.", () => {});
        return;
    }
    try {
        const appId = 'scorecard-pro-app';
        const gamesCollectionRef = collection(window.db, `artifacts/${appId}/users/${window.currentUserId}/scorecard_games`);
        if (currentGame.id) {
            const docRef = doc(gamesCollectionRef, currentGame.id);
            await setDoc(docRef, { ...currentGame, createdAt: currentGame.createdAt || serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
        } else {
            const docRef = await addDoc(gamesCollectionRef, { ...currentGame, createdAt: serverTimestamp() });
            currentGame.id = docRef.id;
        }
        showModal("Success!", "Game saved successfully!", () => {});
    } catch (error) {
        console.error("Error saving game:", error);
        showModal("Save Error", "Failed to save game. Please try again.", () => {});
    }
}

function fetchSavedGames() {
    if (!window.db || !window.currentUserId) {
        noSavedGamesMessage.textContent = "Cannot load saved games. Firebase not initialized or user not authenticated.";
        noSavedGamesMessage.classList.remove('hidden');
        savedGamesList.innerHTML = '';
        return;
    }
    const appId = 'scorecard-pro-app';
    const gamesCollectionRef = collection(window.db, `artifacts/${appId}/users/${window.currentUserId}/scorecard_games`);
    const q = query(gamesCollectionRef);
    onSnapshot(q, (snapshot) => {
        savedGamesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        savedGamesData.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
        renderSavedGamesList();
    }, (error) => {
        console.error("Error fetching saved games:", error);
        showModal("Error", "Failed to load saved games. Please try again later.", () => {});
        noSavedGamesMessage.textContent = "Failed to load saved games.";
        noSavedGamesMessage.classList.remove('hidden');
        savedGamesList.innerHTML = '';
    });
}

function renderSavedGamesList() {
    savedGamesList.innerHTML = '';
    if (savedGamesData.length === 0) {
        noSavedGamesMessage.classList.remove('hidden');
    } else {
        noSavedGamesMessage.classList.add('hidden');
        savedGamesData.forEach(game => {
            const li = document.createElement('li');
            li.className = 'flex flex-col sm:flex-row items-center justify-between py-4 px-2 hover:bg-gray-50 transition-colors rounded-lg';
            li.innerHTML = `
                <span class="text-lg font-medium text-gray-900 mb-2 sm:mb-0 sm:mr-4 flex-grow break-words text-center sm:text-left">
                    ${game.name}
                    <span class="block text-sm text-gray-500 font-normal">
                        ${game.createdAt && game.createdAt.toDate ? `Saved: ${game.createdAt.toDate().toLocaleString()}` : ''}
                    </span>
                </span>
                <div class="flex space-x-3">
                    <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base load-game-btn" data-id="${game.id}">Load</button>
                    <button class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm sm:text-base rename-game-btn" data-id="${game.id}" data-name="${game.name}">Rename</button>
                    <button class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm sm:text-base delete-game-btn" data-id="${game.id}">Delete</button>
                </div>`;
            savedGamesList.appendChild(li);
        });

        savedGamesList.querySelectorAll('.load-game-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameId = e.target.dataset.id;
                const gameToLoad = savedGamesData.find(g => g.id === gameId);
                if (gameToLoad) {
                    currentGame = gameToLoad;
                    showView('gameBoard');
                    renderGameBoard(currentGame);
                }
            });
        });

        savedGamesList.querySelectorAll('.rename-game-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const gameId = e.target.dataset.id;
                const currentName = e.target.dataset.name;
                showModal('Rename Game', '', async (newName) => {
                    if (newName && newName.trim() !== '') {
                        if (window.db && window.currentUserId) {
                            const appId = 'scorecard-pro-app';
                            try {
                                await updateDoc(doc(window.db, `artifacts/${appId}/users/${window.currentUserId}/scorecard_games`, gameId), {
                                    name: newName.trim(),
                                    updatedAt: serverTimestamp()
                                });
                            } catch (error) {
                                console.error("Error renaming game:", error);
                                showModal("Error", "Failed to rename game.", () => {});
                            }
                        }
                    } else {
                        showModal('Invalid Name', 'Game name cannot be empty.', () => {});
                    }
                }, () => {}, true, true, currentName);
            });
        });

        savedGamesList.querySelectorAll('.delete-game-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const gameId = e.target.dataset.id;
                showModal('Delete Game?', 'Are you sure you want to delete this game?', async () => {
                    if (window.db && window.currentUserId) {
                        const appId = 'scorecard-pro-app';
                        try {
                            await deleteDoc(doc(window.db, `artifacts/${appId}/users/${window.currentUserId}/scorecard_games`, gameId));
                        } catch (error) {
                            console.error("Error deleting game:", error);
                            showModal("Error", "Failed to delete game.", () => {});
                        }
                    }
                }, () => {}, true);
            });
        });
    }
}

window.initApp = function() {
    if (window.isFirebaseReady) {
        showView('start');
    } else {
        showModal("Initialization Error", "Failed to initialize Firebase. Some features may not work.", () => showView('start'));
    }

    savedGamesBtn.addEventListener('click', () => {
        showView('savedGames');
        fetchSavedGames();
    });
    newGameBtn.addEventListener('click', () => showView('newOptions'));
    backToMainHomeBtn.addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    selectStandardBtn.addEventListener('click', () => {
        showView('standardSetup');
        const initialPlayerNames = Array.from({ length: parseInt(numPlayersStandardInput.value) || 2 }, (_, i) => `Player ${i + 1}`);
        renderPlayerNameInputs(playerNamesStandardContainer, parseInt(numPlayersStandardInput.value) || 2, initialPlayerNames, () => {});
    });
    selectCustomBtn.addEventListener('click', () => {
        showView('customSetup');
        const initialPlayerNames = Array.from({ length: parseInt(numPlayersCustomInput.value) || 2 }, (_, i) => `Player ${i + 1}`);
        renderPlayerNameInputs(playerNamesCustomContainer, parseInt(numPlayersCustomInput.value) || 2, initialPlayerNames, () => {});
    });
    backFromNewOptionsBtn.addEventListener('click', () => showView('start'));

    numPlayersStandardInput.addEventListener('input', (e) => {
        const num = Math.max(1, parseInt(e.target.value) || 1);
        const currentNames = Array.from(playerNamesStandardContainer.querySelectorAll('input[type="text"]')).map(input => input.value);
        const newNames = Array.from({ length: num }, (_, i) => currentNames[i] || `Player ${i + 1}`);
        renderPlayerNameInputs(playerNamesStandardContainer, num, newNames, () => {});
    });
    startGameStandardBtn.addEventListener('click', () => {
        const playerInputs = Array.from(playerNamesStandardContainer.querySelectorAll('input[type="text"]'));
        const playerNames = playerInputs.map(input => input.value.trim());
        if (playerNames.some(name => name === '')) {
            showModal("Input Error", "Please enter names for all players.", () => {});
            return;
        }
        currentGame = {
            id: null,
            type: 'standard',
            playerNames,
            roundScores: [],
            customColumnNames: {},
            customRowNames: {},
            showTotalColumn: true,
            showTotalAtEnd: false,
            numRounds: null,
            name: `Standard Game - ${new Date().toLocaleString()}`
        };
        showView('gameBoard');
        renderGameBoard(currentGame);
    });
    backFromStandardSetupBtn.addEventListener('click', () => showView('newOptions'));

    numPlayersCustomInput.addEventListener('input', (e) => {
        const num = Math.max(1, parseInt(e.target.value) || 1);
        const currentNames = Array.from(playerNamesCustomContainer.querySelectorAll('input[type="text"]')).map(input => input.value);
        const newNames = Array.from({ length: num }, (_, i) => currentNames[i] || `Player ${i + 1}`);
        renderPlayerNameInputs(playerNamesCustomContainer, num, newNames, () => {});
    });
    startGameCustomBtn.addEventListener('click', () => {
        const playerInputs = Array.from(playerNamesCustomContainer.querySelectorAll('input[type="text"]'));
        const playerNames = playerInputs.map(input => input.value.trim());
        const numRounds = numRoundsCustomInput.value === '' ? null : parseInt(numRoundsCustomInput.value);
        if (playerNames.some(name => name === '')) {
            showModal("Input Error", "Please enter names for all players.", () => {});
            return;
        }
        if (numRounds !== null && (isNaN(numRounds) || numRounds < 1)) {
            showModal("Input Error", "Number of rounds must be a positive number or left blank.", () => {});
            return;
        }
        currentGame = {
            id: null,
            type: 'custom',
            playerNames,
            roundScores: [],
            customColumnNames: {},
            customRowNames: {},
            numRounds,
            showTotalColumn: showTotalColumnCheckbox.checked,
            showTotalAtEnd: showTotalAtEndCheckbox.checked,
            name: `Custom Game - ${new Date().toLocaleString()}`
        };
        showView('gameBoard');
        renderGameBoard(currentGame);
    });
    backFromCustomSetupBtn.addEventListener('click', () => showView('newOptions'));

    gameNameInput.addEventListener('input', (e) => {
        if (currentGame) currentGame.name = e.target.value;
    });
    saveGameBtn.addEventListener('click', saveGame);
    backToHomeFromGameBtn.addEventListener('click', () => {
        showModal('Confirm Exit', 'Any unsaved changes will be lost. Are you sure?', () => {
            currentGame = null;
            showView('start');
        }, () => {}, true);
    });
    addNewRoundBtn.addEventListener('click', handleAddRound);
    backToHomeFromSavedBtn.addEventListener('click', () => showView('start'));
}