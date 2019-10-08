<template>
  <nu-block class="live-notifications">
    <nu-flow gap=".5" items="flex-end">
      <template
        v-for="(notification, index) in Notifications.items">
        <nu-block
          v-if="notification.sticky"
          :key="notification.id"
          class="notification"
          shadow border radius
          cursor="pointer"
          :width="index ? 24 : 30"
          @click="Notifications.unstick(notification)"
          :theme="themeMap[notification.type]" padding=".5 1" :mod="index ? 'xs' : 'md'"
          background>
          <nu-flex gap="1" items="center start">
            <nu-icon :name="iconMap[notification.type]"
                     :size="index ? 1 : (notification.action ? 2 : 1.5)"></nu-icon>
            <nu-flow grow="1" gap=".5">
              <nu-block v-html="getMessage(notification)"></nu-block>
              <nu-flex gap=".5" v-if="notification.action">
                <nu-link v-if="notification.action" @tap="notification.callback">
                  {{ $t(`actions.${notification.action}`) }}
                </nu-link>
              </nu-flex>
            </nu-flow>
          </nu-flex>
        </nu-block>
      </template>
    </nu-flow>
  </nu-block>
</template>

<script>
import Notifications, {
  NOTIFICATIONS_ICONS,
  NOTIFICATIONS_THEMES,
} from '@/services/notifications';

export default {
  name: 'live-notifications',
  data() {
    return {
      Notifications,
      themeMap: NOTIFICATIONS_THEMES,
      iconMap: NOTIFICATIONS_ICONS,
    };
  },
  methods: {
    getMessage(notification) {
      const key = `notification.${notification.message}`;

      return this.$te(key)
        ? this.$t(key)
        : notification.message;
    },
  },
};
</script>

<style scoped>
.live-notifications {
  position: fixed;
  top: 5rem;
  right: 1rem;
  z-index: 9999;
}

.notification {
  opacity: .9;
  transition: width var(--nu-theme-animation-time) linear,
  font-size var(--nu-theme-animation-time) linear,
  line-height var(--nu-theme-animation-time) linear;
}
</style>
