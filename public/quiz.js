(() => {
  const ROLES = {
    operator: {
      name: 'Operator',
      tagline: 'You make things run.',
      blurb: "You keep things moving and organized. Notice the specific moments when you naturally take charge of a plan, a schedule, a group.",
      lanes: ['Sports management', 'Business operations', 'Event logistics', 'Entrepreneurship ops', 'Supply chain', 'Hospitality management', 'Nonprofit operations']
    },
    storyteller: {
      name: 'Storyteller',
      tagline: 'You shape how it gets seen.',
      blurb: "You're good at getting people's attention or explaining things clearly. Notice what topics you like to talk about or moments you like to capture.",
      lanes: ['Media', 'Content creation', 'Broadcasting', 'Marketing', 'Journalism', 'Public relations', 'Social media strategy']
    },
    advocate: {
      name: 'Advocate',
      tagline: 'You show up for people.',
      blurb: "People come to you when they need someone. Notice who you're drawn to helping and what kind of support you're actually good at giving.",
      lanes: ['Coaching', 'Education', 'Nonprofit work', 'Community organizing', 'Social work', 'Youth development', 'Counseling']
    },
    builder: {
      name: 'Builder',
      tagline: 'You put in the work.',
      blurb: "You put in work most people wouldn't. Notice what you build or work on without anyone making you.",
      lanes: ['Entrepreneurship', 'Athletic training', 'Health and performance', 'Skilled trades', 'Product development', 'Physical therapy']
    },
    creative: {
      name: 'Creative',
      tagline: 'You make something from nothing.',
      blurb: "You make things other people wouldn't think to make. Notice what you're drawn to creating when there's no assignment behind it.",
      lanes: ['Art', 'Design', 'Fashion', 'Creative production', 'Photography', 'Music production', 'Film']
    },
    scholar: {
      name: 'Scholar',
      tagline: 'You go deep.',
      blurb: "You go deep on things. Notice what you get curious about outside of class, not just what you're good at when someone's grading you.",
      lanes: ['Research', 'Law', 'Medicine', 'Academics', 'Engineering', 'Data science', 'Public policy']
    }
  };

  const QUESTIONS = [
    {
      text: "On a team, you're usually the one who...",
      answers: [
        { role: 'operator', text: 'makes sure everything runs smoothly, schedules, gear, logistics' },
        { role: 'storyteller', text: 'documents it, posts about it, tells people what happened' },
        { role: 'advocate', text: 'checks on teammates and makes sure everyone feels included' },
        { role: 'builder', text: 'trains the hardest and pushes to get better every day' },
        { role: 'creative', text: 'comes up with ideas for gear, content, or how the team shows up' },
        { role: 'scholar', text: 'studies the game, stats, and plays deeper than anyone else' }
      ]
    },
    {
      text: "In your free time, you're most likely to be...",
      answers: [
        { role: 'operator', text: 'planning something out, organizing people or events' },
        { role: 'storyteller', text: 'making videos, posts, or content' },
        { role: 'advocate', text: 'mentoring or helping someone younger than you' },
        { role: 'builder', text: 'working out, training, or building something with your hands' },
        { role: 'creative', text: 'drawing, designing, styling, or making something from scratch' },
        { role: 'scholar', text: 'reading, researching, or going deep on a topic that interests you' }
      ]
    },
    {
      text: 'People come to you when they need...',
      answers: [
        { role: 'operator', text: 'someone to make a plan happen' },
        { role: 'storyteller', text: 'someone to help them tell their story or get noticed' },
        { role: 'advocate', text: 'advice, support, or someone to talk to' },
        { role: 'builder', text: 'motivation to actually get something done' },
        { role: 'creative', text: 'something to look good or feel original' },
        { role: 'scholar', text: 'someone to explain something complicated' }
      ]
    },
    {
      text: "If you got hurt and couldn't play for a season, you'd probably...",
      answers: [
        { role: 'operator', text: 'help manage the team from the sideline' },
        { role: 'storyteller', text: 'start documenting the season from a new angle' },
        { role: 'advocate', text: 'focus on supporting your teammates through it' },
        { role: 'builder', text: 'use the time to build something new, a business, a skill, a plan' },
        { role: 'creative', text: 'pour that energy into something creative' },
        { role: 'scholar', text: 'use the time to study something you have always been curious about' }
      ]
    },
    {
      text: "Your friends would say you're the one who...",
      answers: [
        { role: 'operator', text: 'keeps everything organized' },
        { role: 'storyteller', text: 'always has the best content or the best way of explaining things' },
        { role: 'advocate', text: 'genuinely cares how people are doing' },
        { role: 'builder', text: 'never stops working toward something' },
        { role: 'creative', text: 'has their own style, no one else does it like you' },
        { role: 'scholar', text: 'actually knows what they are talking about' }
      ]
    },
    {
      text: "If no one was watching, you'd probably be...",
      answers: [
        { role: 'operator', text: 'figuring out how to make something run better' },
        { role: 'storyteller', text: 'capturing a moment, telling a story' },
        { role: 'advocate', text: 'checking in on someone who needs it' },
        { role: 'builder', text: 'training, building, working on your craft' },
        { role: 'creative', text: 'making something, art, design, anything' },
        { role: 'scholar', text: 'reading, researching, or learning something new' }
      ]
    }
  ];

  let state = resetState();

  function resetState() {
    return { firstName: '', lastName: '', currentQuestion: 0, answers: [] };
  }

  function shuffle(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  function renderQuestion() {
    const question = QUESTIONS[state.currentQuestion];
    document.getElementById('q-current').textContent = String(state.currentQuestion + 1).padStart(2, '0');
    document.getElementById('q-total').textContent = String(QUESTIONS.length).padStart(2, '0');
    document.getElementById('question-text').textContent = question.text;

    const container = document.getElementById('answers');
    container.innerHTML = '';
    shuffle(question.answers).forEach((answer) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'answer-btn';
      btn.textContent = answer.text;
      btn.addEventListener('click', () => selectAnswer(answer.role));
      container.appendChild(btn);
    });
  }

  function selectAnswer(role) {
    state.answers.push(role);
    if (state.currentQuestion < QUESTIONS.length - 1) {
      state.currentQuestion += 1;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    const scores = {};
    const firstPick = {};
    Object.keys(ROLES).forEach((role) => { scores[role] = 0; });

    state.answers.forEach((role, index) => {
      scores[role] += 1;
      if (!(role in firstPick)) firstPick[role] = index;
    });

    const ranked = Object.keys(ROLES).sort((a, b) => {
      if (scores[b] !== scores[a]) return scores[b] - scores[a];
      const fa = firstPick[a] === undefined ? Infinity : firstPick[a];
      const fb = firstPick[b] === undefined ? Infinity : firstPick[b];
      return fa - fb;
    });

    const topRole = ranked[0];
    const secondRole = ranked[1];

    showResults(topRole, secondRole);
    submitResults(topRole, secondRole);
  }

  function buildResultCard(kind, roleId, rankLabel) {
    const role = ROLES[roleId];
    const card = document.createElement('div');
    card.className = `result-card ${kind}`;

    const rank = document.createElement('p');
    rank.className = 'result-rank';
    rank.textContent = rankLabel;
    card.appendChild(rank);

    const name = document.createElement('h3');
    name.className = 'result-role';
    name.textContent = role.name;
    card.appendChild(name);

    const tagline = document.createElement('p');
    tagline.className = 'result-tagline';
    tagline.textContent = role.tagline;
    card.appendChild(tagline);

    const blurb = document.createElement('p');
    blurb.className = 'result-blurb';
    blurb.textContent = role.blurb;
    card.appendChild(blurb);

    const list = document.createElement('ul');
    list.className = 'result-lanes';
    role.lanes.forEach((lane) => {
      const li = document.createElement('li');
      li.textContent = lane;
      list.appendChild(li);
    });
    card.appendChild(list);

    return card;
  }

  function showResults(topRole, secondRole) {
    document.getElementById('results-name').textContent = `${state.firstName} ${state.lastName}`;
    const grid = document.getElementById('results-grid');
    grid.innerHTML = '';
    grid.appendChild(buildResultCard('top', topRole, 'Top match'));
    grid.appendChild(buildResultCard('second', secondRole, 'Second match'));
    showScreen('screen-results');
  }

  function submitResults(topRole, secondRole) {
    fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: state.firstName,
        lastName: state.lastName,
        topRole,
        secondRole
      })
    }).catch((err) => {
      console.error('Could not save results.', err);
    });
  }

  function startQuiz(firstName, lastName) {
    state = resetState();
    state.firstName = firstName;
    state.lastName = lastName;
    showScreen('screen-quiz');
    renderQuestion();
  }

  function retakeQuiz() {
    state = resetState();
    document.getElementById('name-form').reset();
    document.getElementById('name-error').classList.remove('visible');
    showScreen('screen-name');
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('name-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const firstName = document.getElementById('first-name').value.trim();
      const lastName = document.getElementById('last-name').value.trim();
      const errorEl = document.getElementById('name-error');

      if (!firstName || !lastName) {
        errorEl.classList.add('visible');
        return;
      }
      errorEl.classList.remove('visible');
      startQuiz(firstName, lastName);
    });

    document.getElementById('retake-btn').addEventListener('click', retakeQuiz);
  });
})();
