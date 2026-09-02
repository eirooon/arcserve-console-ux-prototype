import slackIcon from "../../assets/messaging/slack.png";
import teamsIcon from "../../assets/messaging/teams.png";
import telegramIcon from "../../assets/messaging/telegram.png";

export const MESSAGING_STEP_COPY = {
  title: "How would you like to configure your messaging channels?",
  description:
    "Customize your messaging preferences to ensure that ArcGenie sends you reports, alerts, and insights directly via in-app notifications and email.",
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

export const MESSAGE_PREVIEW = {
  sender: "Arcserve ArcGenie",
  timestamp: "2:43 PM",
  title: "Approval Required",
  summary: "New source has been discovered.",
  details: [
    { label: "Source", value: "sample_machine_01" },
    { label: "Source Type", value: "Windows (Agent)" },
    { label: "Current Plan", value: "No plan" },
    { label: "Proposed Plan", value: "Mission-Critical" },
    { label: "Reason", value: "The only plan configured that can protect this node." },
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
