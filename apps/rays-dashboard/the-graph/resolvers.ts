import { Resolvers } from '.graphclient'

export const resolvers: Resolvers = {
  User: {
    // chainName can exist already in root as we pass it in the other resolver
    chainName: (root, _, context) => root.chainName || context.chainName || '', // The value we provide in the config
  },
  Query: {
    crossUsers: async (root, args, context, info) =>
      Promise.all(
        args.chainNames.map((chainName) =>
          context['summer-events'].Query.users({
            root,
            args,
            context: {
              ...context,
              chainName,
            },
            info,
          }).then((users) => {
            // We send chainName here so we can take it in the resolver above
            return users.map((user) => ({
              ...user,
              chainName: chainName.replace('-', ''),
            }))
          }),
        ),
      ).then((allRebases) => allRebases.flat()),
  },
}
