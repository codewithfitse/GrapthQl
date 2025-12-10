import express from "express";
import cors from "cors";
import { expressMiddleware } from "@as-integrations/express5";
import createApolloGraphqlServer from "./graphql/index.js";
import UserService from "./services/user.js";

async function init() {

	const app = express();
	const PORT = Number(process.env.PORT) || 8000;

	app.use(express.json());
	app.use(cors({
		origin: "http://localhost:5173",
	}));

	app.get('/', (req, res) => {
		res.json({ message: 'Server is up and running' });
	});

	app.use('/graphql', expressMiddleware(await createApolloGraphqlServer(), {
		context: async ({ req }) => {
			// @ts-ignore
			const token = req.headers.authorization?.split(" ")[1];

			try {
				const user = UserService.decodeJWTToken(token as string);
				return { user };
			} catch(error) {
				return {};
			}
		}
	}));

	app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
}

init();