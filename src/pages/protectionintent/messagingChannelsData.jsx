import slackIcon from "../../assets/messaging/slack.png";
import teamsIcon from "../../assets/messaging/teams.png";
import telegramIcon from "../../assets/messaging/telegram.png";

export const MESSAGING_STEP_COPY = {
  title: "How would you like to configure your messaging channels?",
  description:
    "Choose one messaging channel for ArcGenie to send reports, alerts, and insights to.",
};

export const NOTIFICATION_TYPES = [
  { key: "criticalAlerts", label: "Critical alerts" },
  { key: "approvalRequests", label: "Approval requests" },
  { key: "dailyDigest", label: "Daily digest" },
];

export const MESSAGING_CHANNELS = [
  { id: "slack", name: "Slack", icon: slackIcon, defaultChannelName: "#arcgenie-goals" },
  { id: "teams", name: "Microsoft Teams", icon: teamsIcon, defaultChannelName: "#arcgenie-goals" },
  { id: "telegram", name: "Telegram", icon: telegramIcon, defaultChannelName: "#arcgenie-goals" },
];

// Which room/channel within the connected service to route messages to.
export const CHANNEL_NAME_OPTIONS = ["#arcgenie-goals", "#arcgenie-alerts", "#general"];

export const MESSAGE_PREVIEW = {
  sender: "Arcserve ArcGenie",
  timestamp: "2:43 PM",
  title: "New source found.",
  summary:
    "Mission-Critical is the only plan that fits this node. Approve to assign it, deploy the agent, and start the first backup.",
  details: [
    { label: "Source", value: "sample_machine_01 (Windows)" },
    { label: "Current Plan", value: "No plan (No recovery points)" },
    { label: "Proposed Plan", value: "Mission-Critical (hourly · 30d retention)" },
  ],
};

export function buildInitialMessagingChannels() {
  return MESSAGING_CHANNELS.map((channel) => ({
    id: channel.id,
    connected: false,
    channelName: channel.defaultChannelName,
    criticalAlerts: true,
    approvalRequests: true,
    dailyDigest: true,
  }));
}
