import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';

export const scheduleBillReminder = async (bill: Bill) => {
  const nextDueDate = getNextDueDate(bill.due_day);
  const remindDate = dayjs(nextDueDate).subtract(bill.remind_days_before, 'day');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `💸 Sắp đến hạn: ${bill.name}`,
      body: `Hóa đơn ${formatCurrency(bill.amount)} đến hạn trong ${bill.remind_days_before} ngày`,
    },
    trigger: {
      date: remindDate.toDate(),
    },
  });
};