import React, { useState } from 'react';

const initialState = {
  leftM: 3,
  leftC: 3,
  rightM: 0,
  rightC: 0,
  boat: 'left',
  boatM: 0,
  boatC: 0,
};

function isValid({ leftM, leftC, rightM, rightC }) {
  if ((leftM > 0 && leftM < leftC) || (rightM > 0 && rightM < rightC)) return false;
  if ([leftM, leftC, rightM, rightC].some((n) => n < 0 || n > 3)) return false;
  return true;
}

function isGoal({ leftM, leftC, rightM, rightC }) {
  return leftM === 0 && leftC === 0 && rightM === 3 && rightC === 3;
}

export default function MissionariesCannibalsGame() {
  const [state, setState] = useState(initialState);
  const [message, setMessage] = useState('');

  function moveToBoat(type) {
    if (state.boat === 'left' && state[`left${type}`] > 0 && state.boatM + state.boatC < 2) {
      setState((s) => ({ ...s, [`left${type}`]: s[`left${type}`] - 1, [`boat${type}`]: s[`boat${type}`] + 1 }));
    } else if (state.boat === 'right' && state[`right${type}`] > 0 && state.boatM + state.boatC < 2) {
      setState((s) => ({ ...s, [`right${type}`]: s[`right${type}`] - 1, [`boat${type}`]: s[`boat${type}`] + 1 }));
    }
  }

  function moveFromBoat(type) {
    if (state.boat === 'left' && state[`boat${type}`] > 0) {
      setState((s) => ({ ...s, [`left${type}`]: s[`left${type}`] + 1, [`boat${type}`]: s[`boat${type}`] - 1 }));
    } else if (state.boat === 'right' && state[`boat${type}`] > 0) {
      setState((s) => ({ ...s, [`right${type}`]: s[`right${type}`] + 1, [`boat${type}`]: s[`boat${type}`] - 1 }));
    }
  }

  function sail() {
    if (state.boatM + state.boatC === 0) {
      setMessage('The boat must have at least one passenger!');
      return;
    }
    let newState = { ...state, boat: state.boat === 'left' ? 'right' : 'left' };
    if (!isValid(newState)) {
      setMessage('Invalid move! Cannibals would eat missionaries.');
      return;
    }
    setState(newState);
    setMessage('');
  }

  function disembarkAll() {
    let updates = {};
    if (state.boat === 'left') {
      updates.leftM = state.leftM + state.boatM;
      updates.leftC = state.leftC + state.boatC;
    } else {
      updates.rightM = state.rightM + state.boatM;
      updates.rightC = state.rightC + state.boatC;
    }
    updates.boatM = 0;
    updates.boatC = 0;
    let newState = { ...state, ...updates };
    if (!isValid(newState)) {
      setMessage('Invalid move! Cannibals would eat missionaries.');
      return;
    }
    setState(newState);
    setMessage('');
    if (isGoal(newState)) setMessage('🎉 You Won!');
  }

  function reset() {
    setState(initialState);
    setMessage('');
  }

  function renderPeople(n, type, onClick) {
    return Array.from({ length: n }).map((_, i) => (
      <button key={i} className={`person ${type}`} onClick={onClick}>{type === 'M' ? '🧑‍🦱' : '😈'}</button>
    ));
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <h2>Missionaries and Cannibals</h2>
      <p>Goal: Move all to the right without ever letting cannibals outnumber missionaries on either bank.</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: 20 }}>
        <div>
          <div>Left Bank</div>
          <div>
            {renderPeople(state.leftM, 'M', () => moveToBoat('M'))}
            {renderPeople(state.leftC, 'C', () => moveToBoat('C'))}
          </div>
        </div>
        <div>
          <div>{state.boat === 'left' ? '🛶' : ''}</div>
          <div style={{ margin: 5 }}>
            {renderPeople(state.boatM, 'M', () => moveFromBoat('M'))}
            {renderPeople(state.boatC, 'C', () => moveFromBoat('C'))}
          </div>
          <div>{state.boat === 'right' ? '🛶' : ''}</div>
          <button style={{ margin: 5 }} onClick={sail}>Sail</button>
          <button style={{ margin: 5 }} onClick={disembarkAll}>Disembark</button>
        </div>
        <div>
          <div>Right Bank</div>
          <div>
            {renderPeople(state.rightM, 'M', () => moveToBoat('M'))}
            {renderPeople(state.rightC, 'C', () => moveToBoat('C'))}
          </div>
        </div>
      </div>
      <div style={{ color: 'red', minHeight: 24 }}>{message}</div>
      <button onClick={reset} style={{ marginTop: 14 }}>Reset</button>
      <style>{`
        .person { font-size: 2rem; margin: 2px; padding: 2px 4px; border: none; background: none; cursor: pointer; }
        .M { color: #2196f3; }
        .C { color: #b71c1c; }
      `}</style>
    </div>
  );
}
