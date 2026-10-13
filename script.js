const holidayList = [
  { name: '🎄 Новый год', month: 0, day: 1 },
  { name: '🎁 Рождество Христово', month: 0, day: 7 },
  { name: '🛡️ День защитника Отечества', month: 1, day: 23 },
  { name: '🌷 Международный женский день', month: 2, day: 8 },
  { name: '🌸 Праздник Весны и Труда', month: 4, day: 1 },
  { name: '🎖️ День Победы', month: 4, day: 9 },
  { name: '🇷🇺 День России', month: 5, day: 12 },
  { name: '🕊️ День народного единства', month: 10, day: 4 }
];

function tickClock() {
  const now = new Date();

  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').innerText = hh + ':' + mm + ':' + ss;

  const dd = String(now.getDate()).padStart(2, '0');
  const mo = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  document.getElementById('today').innerText = 'Сегодня: ' + dd + '.' + mo + '.' + yyyy;
}

tickClock();
setInterval(tickClock, 1000);

function holidayDateFor(holiday, year) {
  return new Date(year, holiday.month, holiday.day);
}

function nextDateFor(holiday) {
  const now = new Date();
  let d = holidayDateFor(holiday, now.getFullYear());
  if (d < now) {
    d = holidayDateFor(holiday, now.getFullYear() + 1);
  }
  return d;
}

function daysLeft(date) {
  const now = new Date();
  return Math.ceil((date - now) / (1000 * 60 * 60 * 24));
}

function renderNearest() {
  const now = new Date();

  const prepared = holidayList.map(h => {
    const next = nextDateFor(h);
    return {
      name: h.name,
      date: next,
      days: daysLeft(next)
    };
  });

  prepared.sort((a, b) => a.days - b.days);

  const nearest = prepared[0];
  document.getElementById('nearest-name').innerText = nearest.name;
  document.getElementById('nearest-days').innerText = 'Осталось: ' + nearest.days + ' дней';

  const prev = new Date(nearest.date);
  prev.setFullYear(prev.getFullYear() - 1);

  const total = nearest.date - prev;
  const passed = now - prev;
  const percent = Math.min(100, Math.max(0, (passed / total) * 100));

  document.getElementById('progress-fill').style.width = percent + '%';
  document.getElementById('progress-text').innerText =
    'Прошло ' + Math.round(percent) + '% времени до праздника';

  const box = document.getElementById('holidays-list');
  box.innerHTML = '';

  prepared.forEach(h => {
    const row = document.createElement('div');
    row.className = 'holiday-item';
    row.innerHTML =
      '<span class="name">' + h.name + '</span>' +
      '<span class="days">' + h.days + ' дн.</span>';
    box.appendChild(row);
  });
}

renderNearest();
setInterval(renderNearest, 60000);

function showCustomDays() {
  const value = document.getElementById('user-date').value;

  if (!value) {
    document.getElementById('custom-result').innerText = 'Пожалуйста, выбери дату';
    return;
  }

  const now = new Date();
  const target = new Date(value);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

  if (diff < 0) {
    document.getElementById('custom-result').innerText =
      'Эта дата уже прошла (' + Math.abs(diff) + ' дней назад)';
  } else if (diff === 0) {
    document.getElementById('custom-result').innerText = 'Это сегодня! 🎉';
  } else {
    document.getElementById('custom-result').innerText =
      'До этой даты осталось: ' + diff + ' дней';
  }
}

function calcDifference() {
  const fromValue = document.getElementById('date-from').value;
  const toValue = document.getElementById('date-to').value;

  if (!fromValue || !toValue) {
    document.getElementById('diff-result').innerText = 'Выбери обе даты';
    return;
  }

  const fromDate = new Date(fromValue);
  const toDate = new Date(toValue);

  if (toDate < fromDate) {
    document.getElementById('diff-result').innerText =
      'Вторая дата должна быть позже первой';
    return;
  }

  const totalDays = Math.round((toDate - fromDate) / (1000 * 60 * 60 * 24));

  let years = toDate.getFullYear() - fromDate.getFullYear();
  let months = toDate.getMonth() - fromDate.getMonth();
  let days = toDate.getDate() - fromDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  let text = 'Разница: ' + totalDays + ' дней';
  if (years > 0 || months > 0) {
    text += ' (' + years + ' г. ' + months + ' мес. ' + days + ' дн.)';
  }

  document.getElementById('diff-result').innerText = text;
}