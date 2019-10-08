import Logdown from 'logdown';
import User from '@/services/user';

const logger = new Logdown('app.preload-mixin');

export default function PreloadMixin(preload, setPreloadedData) {
  let preloading = false;

  logger.info('init');

  return {
    async beforeRouteEnter(to, from, next) {
      logger.info('preload');
      const stores = await preload(to, from, next);

      preloading = true;

      next((vm) => {
        setPreloadedData.call(vm, stores);
        logger.info('preloaded data applied');
        preloading = false;
      });
    },
    async mounted() {
      // fix issue with hot-reload
      if (process.env.NODE_ENV !== 'production' && !preloading) {
        this.preload()
          .then(() => logger.info('preloaded data applied'));
      }
    },
    methods: {
      async preload() {
        await User.refreshProfile();

        setPreloadedData.bind(this)(await preload(this.$route));
      },
    },
  };
}
