// src/index.ts
import dotenv3 from "dotenv";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// src/infrastructure/database/config/database.ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
var sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB || "app",
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "",
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
  dialectOptions: process.env.NODE_ENV === "production" ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
});
var database_default = sequelize;

// src/shared/utils/Logger.ts
import winston from "winston";
var logFormat = winston.format.printf(
  ({ level, message, context, timestamp }) => {
    return `${timestamp} [${context}] ${level.toUpperCase()} ${message}`;
  }
);
var winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat)
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: winston.format.json()
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: winston.format.json()
    })
  ]
});
var Logger = class {
  constructor(context) {
    this.context = context;
  }
  info(message) {
    winstonLogger.info(message, { context: this.context });
  }
  error(message, error) {
    winstonLogger.error(message, { context: this.context, error });
  }
  warn(message) {
    winstonLogger.warn(message, { context: this.context });
  }
  debug(message) {
    winstonLogger.debug(message, { context: this.context });
  }
};

// src/routes/routes.ts
import { Router } from "express";

// src/infrastructure/http/adapters/route-adapter.ts
var routeAdapter = (controller) => {
  return async (req, res) => {
    const request = {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      userId: req.userId,
      metadata: req.metadata
    };
    const httpResponse = await controller.handle(request);
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  };
};

// src/infrastructure/http/adapters/middleware-adapter.ts
function middlewareAdapter(middleware) {
  return async (request, response, next) => {
    const result = await middleware.handle({
      headers: request.headers
    });
    if ("statusCode" in result) {
      return response.status(result.statusCode).json(result.body);
    }
    if ("data" in result) {
      request.metadata = {
        ...request.metadata,
        ...result.data
      };
    }
    next();
  };
}

// src/infrastructure/database/models/User.ts
import { DataTypes, Model } from "sequelize";
var User = class extends Model {
};
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telephones: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    sequelize: database_default,
    tableName: "users",
    timestamps: true,
    underscored: true
  }
);
var User_default = User;

// src/infrastructure/repository/sequelize/sequelize-users-repository.ts
var SequelizeUsersRepository = class {
  async findByEmail(email) {
    const user = await User_default.findOne({
      where: { email }
    });
    return user;
  }
  async create(data) {
    const user = await User_default.create({
      name: data.name,
      email: data.email,
      password: data.password,
      telephones: data.telephones || []
    });
    return user;
  }
  async findById(userId) {
    const user = await User_default.findByPk(userId);
    if (!user) {
      return null;
    }
    const { id, name, email, telephones, created_at, updated_at } = user.toJSON();
    return {
      id,
      name,
      email,
      telephones,
      createdAt: created_at,
      updatedAt: updated_at
    };
  }
};

// src/application/usecase/sign-up.ts
import bcrypt from "bcrypt";

// src/shared/utils/errors/Invalid-credentials-error.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCredentialsError";
  }
};

// src/shared/utils/errors/user-already-exists.ts
var UserAlreadyExists = class extends Error {
  constructor() {
    super("User already exists");
    this.name = "UserAlreadyExists";
  }
};

// src/shared/utils/errors/user-not-found-error.ts
var UserNotFoundError = class extends Error {
  constructor(message = "Usu\xE1rio n\xE3o encontrado") {
    super(message);
    this.name = "UserNotFoundError";
  }
};

// src/shared/utils/errors/validation-error.ts
var ValidationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
};

// src/config/constant.ts
var ACCESS_TOKEN_EXPIRATION = "1h";
var BCRYPT_SALT_ROUNDS = 12;

// src/domain/value-objects/Email.ts
var Email = class _Email {
  value;
  constructor(value) {
    this.value = value;
  }
  static create(email) {
    if (!email) {
      throw new ValidationError("Email is required");
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      throw new ValidationError("Email is required");
    }
    if (!this.isValid(trimmedEmail)) {
      throw new ValidationError("Please provide a valid e-mail");
    }
    return new _Email(trimmedEmail);
  }
  static isValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  getValue() {
    return this.value;
  }
  equals(other) {
    return this.value === other.value;
  }
  toString() {
    return this.value;
  }
};

// src/domain/value-objects/Password.ts
var Password = class _Password {
  value;
  constructor(value) {
    this.value = value;
  }
  static create(password) {
    if (!password) {
      throw new ValidationError("Password is required");
    }
    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      throw new ValidationError("Password is required");
    }
    if (trimmedPassword.length < 6) {
      throw new ValidationError("Password must have at least 6 characters");
    }
    return new _Password(trimmedPassword);
  }
  getValue() {
    return this.value;
  }
  toString() {
    return this.value;
  }
};

// src/domain/value-objects/Name.ts
var Name = class _Name {
  value;
  constructor(value) {
    this.value = value;
  }
  static create(name) {
    if (!name) {
      throw new ValidationError("Name is required");
    }
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new ValidationError("Name is required");
    }
    if (trimmedName.length < 2) {
      throw new ValidationError("Name must have at least 2 characters");
    }
    return new _Name(trimmedName);
  }
  getValue() {
    return this.value;
  }
  toString() {
    return this.value;
  }
};

// src/domain/value-objects/Telephone.ts
var Telephone = class _Telephone {
  constructor(number, areaCode) {
    this.number = number;
    this.areaCode = areaCode;
  }
  static create(number, areaCode) {
    this.validate(number, areaCode);
    return new _Telephone(number, areaCode);
  }
  static createMany(telephones) {
    if (!telephones || !Array.isArray(telephones) || telephones.length === 0) {
      throw new ValidationError("At least one telephone is required");
    }
    return telephones.map((tel) => this.create(tel.number, tel.area_code));
  }
  static validate(number, areaCode) {
    if (number === void 0 || number === null || isNaN(number)) {
      throw new ValidationError("Phone number is required");
    }
    if (areaCode === void 0 || areaCode === null || isNaN(areaCode)) {
      throw new ValidationError("Area code is required");
    }
    if (!Number.isInteger(number) || number <= 0) {
      throw new ValidationError("Phone number must be a positive integer");
    }
    if (!Number.isInteger(areaCode) || areaCode <= 0) {
      throw new ValidationError("Area code must be a positive integer");
    }
    const numberStr = number.toString();
    if (numberStr.length !== 8 && numberStr.length !== 9) {
      throw new ValidationError("Phone number must have exactly 8 or 9 digits");
    }
    const areaCodeStr = areaCode.toString();
    if (areaCodeStr.length !== 2) {
      throw new ValidationError("Area code must have exactly 2 digits");
    }
  }
  getNumber() {
    return this.number;
  }
  getAreaCode() {
    return this.areaCode;
  }
  getValue() {
    return {
      number: this.number,
      area_code: this.areaCode
    };
  }
};

// src/application/usecase/sign-up.ts
var SignupUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute(params) {
    const { name, email, password, telephones } = params;
    const emailVO = Email.create(email);
    const nameVO = Name.create(name);
    const passwordVO = Password.create(password);
    const telephonesVO = Telephone.createMany(telephones);
    const hasedPassword = await bcrypt.hash(
      passwordVO.getValue(),
      BCRYPT_SALT_ROUNDS
    );
    const userWithSameEmail = await this.usersRepository.findByEmail(
      emailVO.getValue()
    );
    if (userWithSameEmail) {
      throw new UserAlreadyExists();
    }
    const telephonesData = telephonesVO.map((tel) => tel.getValue());
    const createdUser = await this.usersRepository.create({
      name: nameVO.getValue(),
      email: emailVO.getValue(),
      password: hasedPassword,
      telephones: telephonesData
    });
    const userJson = createdUser.toJSON();
    return {
      id: createdUser.id,
      created_at: userJson.created_at,
      modified_at: userJson.updated_at
    };
  }
};

// src/application/controller/helpers/http.ts
var badRequest = (body) => {
  return {
    statusCode: 400,
    body
  };
};
var conflict = (body) => {
  return {
    statusCode: 409,
    body
  };
};
var unauthorized = (body) => {
  return {
    statusCode: 401,
    body
  };
};
var created = (body) => {
  return {
    statusCode: 200,
    body
  };
};
var serverError = () => {
  return {
    statusCode: 500,
    body: {
      errorMessage: "Internal server error"
    }
  };
};
var ok = (body) => {
  return {
    statusCode: 200,
    body
  };
};

// src/application/controller/sign-up.ts
var SignupController = class {
  constructor(signupUserUseCase) {
    this.signupUserUseCase = signupUserUseCase;
  }
  async handle({ body }) {
    try {
      const { email, name, password, telephones } = body;
      const telephonesData = !telephones ? [] : telephones.map((tel) => ({
        number: Number(tel.number),
        area_code: Number(tel.area_code)
      }));
      const { id, created_at, modified_at } = await this.signupUserUseCase.execute({
        email,
        name,
        password,
        telephones: telephonesData
      });
      return created({ id, created_at, modified_at });
    } catch (error) {
      if (error instanceof ValidationError) {
        return badRequest({
          message: error.message
        });
      }
      if (error instanceof UserAlreadyExists) {
        return conflict({
          message: error.message
        });
      }
      if (error instanceof Error) {
        return badRequest({ message: error.message });
      }
      return serverError();
    }
  }
};

// src/application/usecase/sign-in.ts
import { compare } from "bcrypt";
var SignInUseCase = class {
  constructor(usersRepository, jwtAdapter) {
    this.usersRepository = usersRepository;
    this.jwtAdapter = jwtAdapter;
  }
  async generateTokens(payload) {
    const accessToken = this.jwtAdapter.sign(
      { sub: payload },
      ACCESS_TOKEN_EXPIRATION
    );
    return { accessToken };
  }
  async execute({
    email,
    password
  }) {
    const emailVO = Email.create(email);
    const passwordVO = Password.create(password);
    const user = await this.usersRepository.findByEmail(emailVO.getValue());
    if (!user) {
      throw new InvalidCredentialsError();
    }
    const doesPasswordMatches = await compare(
      passwordVO.getValue(),
      user.password
    );
    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }
    const { accessToken } = await this.generateTokens({
      id: user.id,
      email: user.email
    });
    return { accessToken };
  }
};

// src/application/controller/sign-in.ts
var SignInController = class {
  constructor(signInUseCase) {
    this.signInUseCase = signInUseCase;
  }
  async handle(request) {
    try {
      const { email, password } = request.body;
      const { accessToken } = await this.signInUseCase.execute({
        email,
        password
      });
      return ok({ accessToken });
    } catch (error) {
      if (error instanceof ValidationError) {
        return badRequest({
          message: error.message
        });
      }
      if (error instanceof InvalidCredentialsError) {
        return unauthorized({
          message: error.message
        });
      }
      if (error instanceof Error) {
        return badRequest({ message: error.message });
      }
      return serverError();
    }
  }
};

// src/application/usecase/get-user-by-id.ts
var GetUserByIdUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute(userId) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    return {
      user: {
        id: user.id,
        email: user.email,
        telephones: user.telephones || [],
        created_at: user.createdAt,
        modified_at: user.updatedAt
      }
    };
  }
};

// src/application/controller/get-user-by-id-controller.ts
var GetUserByIdController = class {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase;
  }
  async handle(request) {
    try {
      const userId = request.metadata?.id;
      if (!userId) {
        return unauthorized({ errorMessage: "Invalid access token" });
      }
      const { user } = await this.getUserByIdUseCase.execute(userId);
      return ok(user);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return unauthorized({ errorMessage: "User not found" });
      }
      return serverError();
    }
  }
};

// src/domain/JwtAdapter.ts
import jwt from "jsonwebtoken";

// src/config/env.ts
import dotenv2 from "dotenv";
dotenv2.config();
var env = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  port: process.env.PORT || "3000",
  nodeEnv: process.env.NODE_ENV || "development",
  database: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "5432",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "authentication"
  }
};

// src/domain/JwtAdapter.ts
var JwtAdapterImpl = class {
  sign(payload, expiresIn) {
    if (!env.jwtSecret) {
      throw new Error("JWT secret is not defined");
    }
    return jwt.sign(
      payload,
      env.jwtSecret,
      { expiresIn }
    );
  }
};

// src/infrastructure/factories/user-factory.ts
var makeSignupUserController = () => {
  const usersRepository = new SequelizeUsersRepository();
  const signupUserUseCase = new SignupUseCase(usersRepository);
  const signupUserController = new SignupController(signupUserUseCase);
  return signupUserController;
};
var makeSignInController = () => {
  const usersRepository = new SequelizeUsersRepository();
  const jwtAdapter = new JwtAdapterImpl();
  const signInUseCase = new SignInUseCase(usersRepository, jwtAdapter);
  const signInController = new SignInController(signInUseCase);
  return signInController;
};
var makeGetUserByIdController = () => {
  const usersRepository = new SequelizeUsersRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(usersRepository);
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);
  return getUserByIdController;
};

// src/application/middlewares/AuthenticationMiddleware.ts
import jwt2 from "jsonwebtoken";
var AuthenticationMiddleware = class {
  async handle({ headers }) {
    const { authorization } = headers;
    if (!authorization) {
      return {
        statusCode: 401,
        body: { error: "Unauthorized" }
      };
    }
    const [bearer, token] = authorization.split(" ");
    try {
      if (bearer !== "Bearer") {
        return {
          statusCode: 401,
          body: { error: "Unauthorized" }
        };
      }
      const payload = jwt2.verify(token, env.jwtSecret);
      const { sub } = payload;
      if (!sub?.id) {
        return {
          statusCode: 401,
          body: { error: "Invalid Token" }
        };
      }
      return {
        data: {
          id: sub.id,
          email: sub.email
        }
      };
    } catch {
      return {
        statusCode: 401,
        body: { error: "Unauthorized" }
      };
    }
  }
};

// src/infrastructure/factories/middleware-factory.ts
var makeAuthenticationMiddleware = () => {
  return new AuthenticationMiddleware();
};

// src/routes/routes.ts
var router = Router();
router.post("/auth/sign-up", routeAdapter(makeSignupUserController()));
router.post("/auth/sign-in", routeAdapter(makeSignInController()));
router.get(
  "/user",
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetUserByIdController())
);

// src/index.ts
dotenv3.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var logger = new Logger("Server");
var app = express();
app.use(express.json());
app.use(cors());
app.use((_req, _res, next) => {
  next();
});
app.get("/", (_req, res) => res.status(200).json({ status: "API is healthy" }));
var swaggerPath = path.resolve(__dirname, "../docs/swagger.json");
var swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", router);
logger.info("Rotas registradas em /api");
var port = Number(process.env.PORT) || 3e3;
async function bootstrap() {
  try {
    await database_default.authenticate();
    logger.info("Conex\xE3o com banco de dados estabelecida");
    await database_default.sync({ alter: true });
    logger.info("Models sincronizados");
    if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
      app.listen(port, () => {
        logger.info(`Servidor rodando na porta ${port}`);
      });
    }
  } catch (error) {
    logger.error("Falha ao iniciar aplica\xE7\xE3o", error);
    if (error instanceof Error) {
      logger.error(`Detalhes: ${error.message}`);
      console.error(error.stack);
    }
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
}
bootstrap();
var index_default = app;
export {
  index_default as default
};
