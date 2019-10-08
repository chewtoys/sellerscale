<template>
  <MiDropdown
    v-if="notifications.length"
    @click.native="readAll()"
    mod="transparent"
    class="notifications-widget" plain cell popupWidth="24" padding="0">
    <nu-block padding=".5 1|||.5">
      <nu-icon :name="icon" size="2|||1.5" :theme="theme"></nu-icon>
      <nu-badge class="counter" mod="xxs round w6" border="2bw outside" :theme="theme">
        {{ notifications.length }}
      </nu-badge>
<!--      <nu-block class="counter" :mod="`xxs w7 ${theme}`">-->
<!--        {{ Notifications.items.length }}-->
<!--      </nu-block>-->
    </nu-block>
    <template v-slot:content>
      <nu-flow padding="0 .5">
        <template
          v-for="(item, index) in notifications">
          <nu-line
            v-if="index"
            :key="`line.${item.id}`"></nu-line>
          <nu-flex
            :key="`message.${item.id}`"
            :theme="themeMap[item.type]" mod="xs"
            padding=".5 1" gap="1" items="center stretch">
            <nu-icon :name="iconMap[item.type]" size="1.5"></nu-icon>
            <nu-flow grow="1" gap=".5">
              <nu-block v-html="getMessage(item)"></nu-block>
              <nu-flex gap=".5" v-if="item.action">
                <nu-link v-if="item.action" @tap="callback(item)">
                  {{ $t(`actions.${item.action}`) }}
                </nu-link>
              </nu-flex>
            </nu-flow>
          </nu-flex>
        </template>
      </nu-flow>
    </template>
  </MiDropdown>
</template>

<script>
import Notifications, {
  NOTIFICATIONS_ICONS,
  NOTIFICATIONS_THEMES,
} from '@/services/notifications';
import Analytics from '@/services/analytics';

export default {
  name: 'notifications-widget',
  data() {
    return {
      Notifications,
      themeMap: NOTIFICATIONS_THEMES,
      iconMap: NOTIFICATIONS_ICONS,
    };
  },
  computed: {
    theme() {
      return !this.read
        ? (Notifications.items.find(item => (item.type === 'error' && !item.read))
          ? 'danger'
          : 'primary')
        : 'minor';
    },
    icon() {
      return Notifications.items.find(item => item.type === 'error') ? 'alert-triangle' : 'message-circle';
    },
    read() {
      return !Notifications.items.find(item => !item.read);
    },
    notifications() {
      return this.Notifications.items.filter(notification => !notification.sticky);
    },
  },
  methods: {
    getMessage(item) {
      const key = `notification.${item.message}`;

      return this.$te(key)
        ? this.$t(key)
        : item.message;
    },
    readAll() {
      Notifications.readAll();

      Analytics.event('notification-widget:toggle');
    },
    callback(item) {
      if (item.callback) {
        item.callback();
      }
    },
  },
};
</script>

<style scoped>
.counter {
  position: absolute;
  right: .65rem;
  bottom: .85rem;
  padding: .1em .55em 0;
  --nu-theme-border-color: var(--nu-theme-background-color);
}
</style>
