import { ApolloServer, gql } from 'apollo-server'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import Redis from 'ioredis'

const redis = new Redis()

const typeDefs = gql`
	type Query {
		get( key: String! ): String
	}
	type Mutation {
		set( key: String!, value: String! ): Boolean!
	}
`

const resolvers = {
	Query: {
		get: ( parent, { key }, { redis } )=> {
			try {
				return redis.get(key)
			} catch (e) {
				return null
			}
		}
	},
	Mutation: {
		set: async ( parent, { key, value }, { redis } )=> {
			try{
				await redis.set( key, value )
				return true
			} catch (e) { 
				console.error(e) 
				return false
			}
		}
	}
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: { redis },
	plugins: [
		ApolloServerPluginLandingPageGraphQLPlayground(),
	]
})

server.listen().then(({ url })=> {
	console.log(`server on ${url}`)
})

