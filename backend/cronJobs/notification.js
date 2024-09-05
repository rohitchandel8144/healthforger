const { sendEmail } = require('../utils/nodeMailer'); // Adjust path as needed
const Habit = require('../db/models/habits');
const Goal = require('../db/models/goals');
const User = require('../db/models/user');
const cron = require('node-cron');
const { getNotifications } = require('../controllers/progressController');

// Function to start the cron jobs
const startCronJobNotification = () => {
  // Schedule the cron job to run every 5 minutes
  cron.schedule('0 12,20 * * *', async () => {
    try {
      const notifications = await getNotifications();

      // Handle missed habits
      if (notifications.missedHabits.length > 0) {
        for (const missedHabit of notifications.missedHabits) {
          const habit = await Habit.findById(missedHabit._id).select('user_id');

          if (habit) {
            const userId = habit.user_id;
            console.log(`User ID for missed habit ${missedHabit._id}: ${userId}`);

            const user = await User.findById(userId).select('email');
            if (user) {
              const email = user.email;
              await sendEmail(
                email,
                'Missed Habit Notification',
                `You missed completing the habit: ${missedHabit.habit_name}. Please catch up on it.`,
                `<p>You missed completing the habit: <strong>${missedHabit.habit_name}</strong>. Please catch up on it.</p>`
              );
            }
          } else {
            console.error(`Habit not  found for ID: ${missedHabit._id}`);
          }
        }
      } else {
        console.log('No missed habits');
      }

      // Handle upcoming goal deadlines
      if (notifications.upcomingDeadlines.length > 0) {
        for (const deadline of notifications.upcomingDeadlines) {
          const goal = await Goal.findById(deadline._id).select('user_id');

          if (goal) {
            const userId = goal.user_id;
            console.log(`User ID for upcoming goal ${deadline._id}: ${userId}`);

            const user = await User.findById(userId).select('email');
            if (user) {
              const email = user.email;
              await sendEmail(
                email,
                'Upcoming Goal Deadline',
                `Your goal: ${deadline.description} is due on ${deadline.deadline}.`,
                `<p>Your goal: <strong>${deadline.description}</strong> is due on <strong>${deadline.deadline}</strong>.</p>`
              );
            }
          } else {
            console.error(`Goal not found for ID: ${deadline._id}`);
          }
        }
      } else {
        console.log('No upcoming deadlines found');
      }

    } catch (error) {
      console.error('Error running scheduled notifications:', error);
    }
  });

  console.log('Cron jobs started');
};

module.exports = { startCronJobNotification };
