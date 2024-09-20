/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config,
    { isServer, nextRuntime, webpack }
  ) => {
    if (isServer && nextRuntime === 'nodejs') {
      config.plugins.push(
        /**
         * hide warnings from @sentry/nextjs in development
         * https://github.com/getsentry/sentry-javascript/issues/9120
         */
        new webpack.ContextReplacementPlugin(/\/@sentry\//, (data) => {
          // eslint-disable-next-line no-param-reassign
          delete data.dependencies[0]?.critical;
          return data;
        }),
      );
    }
		
    return config
  },
};

export default nextConfig;