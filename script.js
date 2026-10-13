// ===== СПИСОК РОССИЙСКИХ ПРАЗДНИКОВ =====
const holidays = [
  { name: '🎄 Новый год', month: 0, day: 1 },
  { name: '🎁 Рождество Христово', month: 0, day: 7 },
  { name: '🛡️ День защитника Отечества', month: 1, day: 23 },
  { name: '🌷 Международный женский день', month: 2, day: 8 },
  { name: '🌸 Праздник Весны и Труда', month: 4, day: 1 },
  { name: '🎖️ День Победы', month: 4, day: 9 },
  { name: '🇷🇺 День России', month: 5, day: 12 },
  { name: '🕊️ День народного единства', month: 10, day: 4 }
];

// ===== ЧАСЫ =====
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').innerText = hours + ':' + minutes + ':' + seconds;

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  document.getElementById('today').innerText = 'Сегодня: ' + day + '.' + month + '.' + year;
}

updateClock();
setInterval(updateClock, 1000);

// ===== РАСЧЁТ ДАТ ПРАЗДНИКОВ =====
function getHolidayDate(holiday, year) {
  return new Date(year, holiday.month, holiday.day);
}

function getNextHolidayDate(holiday) {
  const now = new Date();
  let date = getHolidayDate(holiday, now.getFullYear());
  if (date < now) {
    date = getHolidayDate(holiday, now.getFullYear() + 1);
  }
  return date;
}

function daysUntil(date) {
  const now = new Date();
  const diff = date - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ===== БЛИЖАЙШИЙ ПРАЗДНИК + ПРОГРЕСС-БАР =====
function updateNearestHoliday() {
  const now = new Date();

  const list = holidays.map(h => ({
    ...h,
    date: getNextHolidayDate(h),
    days: daysUntil(getNextHolidayDate(h))
  }));

  list.sort((a, b) => a.days - b.days);

  const nearest = list[0];
  document.getElementById('nearest-name').innerText = nearest.name;
  document.getElementById('nearest-days').innerText = 'Осталось: ' + nearest.days + ' дней';

  const prevDate = new Date(nearest.date);
  prevDate.setFullYear(prevDate.getFullYear() - 1);

  const total = nearest.date - prevDate;
  const passed = now - prevDate;
  const percent = Math.min(100, Math.max(0, (passed / total) * 100));

  document.getElementById('progress-fill').style.width = percent + '%';
  document.getElementById('progress-text').innerText =
    'Прошло ' + Math.round(percent) + '% времени до праздника';

  const listContainer = document.getElementById('holidays-list');
  listContainer.innerHTML = '';
  list.forEach(h => {
    const item = document.createElement('div');
    item.className = 'holiday-item';
    item.innerHTML = '<span class="name">' + h.name + '</span>' +
                     '<span class="days">' + h.days + ' дн.</span>';
    listContainer.appendChild(item);
  });
}

updateNearestHoliday();
setInterval(updateNearestHoliday, 60000);

// ===== СВОЯ ДАТА =====
function showCustomDays() {
  const input = document.getElementById('user-date').value;

  if (!input) {
    document.getElementById('custom-result').innerText = 'Пожалуйста, выбери дату';
    return;
  }

  const now = new Date();
  const targetDate = new Date(input);
  const diffTime = targetDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    document.getElementById('custom-result').innerText =
      'Эта дата уже прошла (' + Math.abs(diffDays) + ' дней назад)';
  } else if (diffDays === 0) {
    document.getElementById('custom-result').innerText = 'Это сегодня! 🎉';
  } else {
    document.getElementById('custom-result').innerText =
      'До этой даты осталось: ' + diffDays + ' дней';
  }
}

// ===== РАЗНИЦА МЕЖДУ ДВУМЯ ДАТАМИ =====
function calcDifference() {
  const fromInput = document.getElementById('date-from').value;
  const toInput = document.getElementById('date-to').value;

  if (!fromInput || !toInput) {
    document.getElementById('diff-result').innerText = 'Выбери обе даты';
    return;
  }

  const fromDate = new Date(fromInput);
  const toDate = new Date(toInput);

  if (toDate < fromDate) {
    document.getElementById('diff-result').innerText = 
      'Вторая дата должна быть позже первой';
    return;
  }

  // Разница в днях
  const diffTime = toDate - fromDate;
  const totalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Разница в годах, месяцах, днях
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

  let result = 'Разница: ' + totalDays + ' дней';
  if (years > 0 || months > 0) {
    result += ' (' + years + ' г. ' + months + ' мес. ' + days + ' дн.)';
  }

  document.getElementById('diff-result').innerText = result;
}