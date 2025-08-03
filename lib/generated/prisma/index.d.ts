
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Ledger
 * 
 */
export type Ledger = $Result.DefaultSelection<Prisma.$LedgerPayload>
/**
 * Model Bank
 * 
 */
export type Bank = $Result.DefaultSelection<Prisma.$BankPayload>
/**
 * Model Matched
 * 
 */
export type Matched = $Result.DefaultSelection<Prisma.$MatchedPayload>
/**
 * Model GoogleAuth
 * 
 */
export type GoogleAuth = $Result.DefaultSelection<Prisma.$GoogleAuthPayload>
/**
 * Model ProcessedEmail
 * 
 */
export type ProcessedEmail = $Result.DefaultSelection<Prisma.$ProcessedEmailPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ledger`: Exposes CRUD operations for the **Ledger** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ledgers
    * const ledgers = await prisma.ledger.findMany()
    * ```
    */
  get ledger(): Prisma.LedgerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bank`: Exposes CRUD operations for the **Bank** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Banks
    * const banks = await prisma.bank.findMany()
    * ```
    */
  get bank(): Prisma.BankDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.matched`: Exposes CRUD operations for the **Matched** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Matcheds
    * const matcheds = await prisma.matched.findMany()
    * ```
    */
  get matched(): Prisma.MatchedDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.googleAuth`: Exposes CRUD operations for the **GoogleAuth** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GoogleAuths
    * const googleAuths = await prisma.googleAuth.findMany()
    * ```
    */
  get googleAuth(): Prisma.GoogleAuthDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.processedEmail`: Exposes CRUD operations for the **ProcessedEmail** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProcessedEmails
    * const processedEmails = await prisma.processedEmail.findMany()
    * ```
    */
  get processedEmail(): Prisma.ProcessedEmailDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.13.0
   * Query Engine version: 361e86d0ea4987e9f53a565309b3eed797a6bcbd
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Ledger: 'Ledger',
    Bank: 'Bank',
    Matched: 'Matched',
    GoogleAuth: 'GoogleAuth',
    ProcessedEmail: 'ProcessedEmail'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "ledger" | "bank" | "matched" | "googleAuth" | "processedEmail"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Ledger: {
        payload: Prisma.$LedgerPayload<ExtArgs>
        fields: Prisma.LedgerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LedgerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LedgerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerPayload>
          }
          findFirst: {
            args: Prisma.LedgerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LedgerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerPayload>
          }
          findMany: {
            args: Prisma.LedgerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerPayload>[]
          }
          create: {
            args: Prisma.LedgerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerPayload>
          }
          createMany: {
            args: Prisma.LedgerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LedgerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerPayload>[]
          }
          delete: {
            args: Prisma.LedgerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerPayload>
          }
          update: {
            args: Prisma.LedgerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerPayload>
          }
          deleteMany: {
            args: Prisma.LedgerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LedgerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LedgerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerPayload>[]
          }
          upsert: {
            args: Prisma.LedgerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerPayload>
          }
          aggregate: {
            args: Prisma.LedgerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLedger>
          }
          groupBy: {
            args: Prisma.LedgerGroupByArgs<ExtArgs>
            result: $Utils.Optional<LedgerGroupByOutputType>[]
          }
          count: {
            args: Prisma.LedgerCountArgs<ExtArgs>
            result: $Utils.Optional<LedgerCountAggregateOutputType> | number
          }
        }
      }
      Bank: {
        payload: Prisma.$BankPayload<ExtArgs>
        fields: Prisma.BankFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BankFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BankFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankPayload>
          }
          findFirst: {
            args: Prisma.BankFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BankFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankPayload>
          }
          findMany: {
            args: Prisma.BankFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankPayload>[]
          }
          create: {
            args: Prisma.BankCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankPayload>
          }
          createMany: {
            args: Prisma.BankCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BankCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankPayload>[]
          }
          delete: {
            args: Prisma.BankDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankPayload>
          }
          update: {
            args: Prisma.BankUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankPayload>
          }
          deleteMany: {
            args: Prisma.BankDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BankUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BankUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankPayload>[]
          }
          upsert: {
            args: Prisma.BankUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankPayload>
          }
          aggregate: {
            args: Prisma.BankAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBank>
          }
          groupBy: {
            args: Prisma.BankGroupByArgs<ExtArgs>
            result: $Utils.Optional<BankGroupByOutputType>[]
          }
          count: {
            args: Prisma.BankCountArgs<ExtArgs>
            result: $Utils.Optional<BankCountAggregateOutputType> | number
          }
        }
      }
      Matched: {
        payload: Prisma.$MatchedPayload<ExtArgs>
        fields: Prisma.MatchedFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchedFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchedPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchedFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchedPayload>
          }
          findFirst: {
            args: Prisma.MatchedFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchedPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchedFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchedPayload>
          }
          findMany: {
            args: Prisma.MatchedFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchedPayload>[]
          }
          create: {
            args: Prisma.MatchedCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchedPayload>
          }
          createMany: {
            args: Prisma.MatchedCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchedCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchedPayload>[]
          }
          delete: {
            args: Prisma.MatchedDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchedPayload>
          }
          update: {
            args: Prisma.MatchedUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchedPayload>
          }
          deleteMany: {
            args: Prisma.MatchedDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchedUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchedUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchedPayload>[]
          }
          upsert: {
            args: Prisma.MatchedUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchedPayload>
          }
          aggregate: {
            args: Prisma.MatchedAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatched>
          }
          groupBy: {
            args: Prisma.MatchedGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchedGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchedCountArgs<ExtArgs>
            result: $Utils.Optional<MatchedCountAggregateOutputType> | number
          }
        }
      }
      GoogleAuth: {
        payload: Prisma.$GoogleAuthPayload<ExtArgs>
        fields: Prisma.GoogleAuthFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GoogleAuthFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoogleAuthPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GoogleAuthFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoogleAuthPayload>
          }
          findFirst: {
            args: Prisma.GoogleAuthFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoogleAuthPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GoogleAuthFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoogleAuthPayload>
          }
          findMany: {
            args: Prisma.GoogleAuthFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoogleAuthPayload>[]
          }
          create: {
            args: Prisma.GoogleAuthCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoogleAuthPayload>
          }
          createMany: {
            args: Prisma.GoogleAuthCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GoogleAuthCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoogleAuthPayload>[]
          }
          delete: {
            args: Prisma.GoogleAuthDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoogleAuthPayload>
          }
          update: {
            args: Prisma.GoogleAuthUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoogleAuthPayload>
          }
          deleteMany: {
            args: Prisma.GoogleAuthDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GoogleAuthUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GoogleAuthUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoogleAuthPayload>[]
          }
          upsert: {
            args: Prisma.GoogleAuthUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoogleAuthPayload>
          }
          aggregate: {
            args: Prisma.GoogleAuthAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGoogleAuth>
          }
          groupBy: {
            args: Prisma.GoogleAuthGroupByArgs<ExtArgs>
            result: $Utils.Optional<GoogleAuthGroupByOutputType>[]
          }
          count: {
            args: Prisma.GoogleAuthCountArgs<ExtArgs>
            result: $Utils.Optional<GoogleAuthCountAggregateOutputType> | number
          }
        }
      }
      ProcessedEmail: {
        payload: Prisma.$ProcessedEmailPayload<ExtArgs>
        fields: Prisma.ProcessedEmailFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProcessedEmailFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEmailPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProcessedEmailFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEmailPayload>
          }
          findFirst: {
            args: Prisma.ProcessedEmailFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEmailPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProcessedEmailFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEmailPayload>
          }
          findMany: {
            args: Prisma.ProcessedEmailFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEmailPayload>[]
          }
          create: {
            args: Prisma.ProcessedEmailCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEmailPayload>
          }
          createMany: {
            args: Prisma.ProcessedEmailCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProcessedEmailCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEmailPayload>[]
          }
          delete: {
            args: Prisma.ProcessedEmailDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEmailPayload>
          }
          update: {
            args: Prisma.ProcessedEmailUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEmailPayload>
          }
          deleteMany: {
            args: Prisma.ProcessedEmailDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProcessedEmailUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProcessedEmailUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEmailPayload>[]
          }
          upsert: {
            args: Prisma.ProcessedEmailUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEmailPayload>
          }
          aggregate: {
            args: Prisma.ProcessedEmailAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProcessedEmail>
          }
          groupBy: {
            args: Prisma.ProcessedEmailGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProcessedEmailGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProcessedEmailCountArgs<ExtArgs>
            result: $Utils.Optional<ProcessedEmailCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    ledger?: LedgerOmit
    bank?: BankOmit
    matched?: MatchedOmit
    googleAuth?: GoogleAuthOmit
    processedEmail?: ProcessedEmailOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    ledgers: number
    banks: number
    matched: number
    processedEmails: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ledgers?: boolean | UserCountOutputTypeCountLedgersArgs
    banks?: boolean | UserCountOutputTypeCountBanksArgs
    matched?: boolean | UserCountOutputTypeCountMatchedArgs
    processedEmails?: boolean | UserCountOutputTypeCountProcessedEmailsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLedgersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LedgerWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBanksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BankWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMatchedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchedWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProcessedEmailsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProcessedEmailWhereInput
  }


  /**
   * Count Type LedgerCountOutputType
   */

  export type LedgerCountOutputType = {
    matched: number
  }

  export type LedgerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    matched?: boolean | LedgerCountOutputTypeCountMatchedArgs
  }

  // Custom InputTypes
  /**
   * LedgerCountOutputType without action
   */
  export type LedgerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerCountOutputType
     */
    select?: LedgerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LedgerCountOutputType without action
   */
  export type LedgerCountOutputTypeCountMatchedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchedWhereInput
  }


  /**
   * Count Type BankCountOutputType
   */

  export type BankCountOutputType = {
    matched: number
  }

  export type BankCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    matched?: boolean | BankCountOutputTypeCountMatchedArgs
  }

  // Custom InputTypes
  /**
   * BankCountOutputType without action
   */
  export type BankCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BankCountOutputType
     */
    select?: BankCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BankCountOutputType without action
   */
  export type BankCountOutputTypeCountMatchedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchedWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ledgers?: boolean | User$ledgersArgs<ExtArgs>
    banks?: boolean | User$banksArgs<ExtArgs>
    matched?: boolean | User$matchedArgs<ExtArgs>
    processedEmails?: boolean | User$processedEmailsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ledgers?: boolean | User$ledgersArgs<ExtArgs>
    banks?: boolean | User$banksArgs<ExtArgs>
    matched?: boolean | User$matchedArgs<ExtArgs>
    processedEmails?: boolean | User$processedEmailsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      ledgers: Prisma.$LedgerPayload<ExtArgs>[]
      banks: Prisma.$BankPayload<ExtArgs>[]
      matched: Prisma.$MatchedPayload<ExtArgs>[]
      processedEmails: Prisma.$ProcessedEmailPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ledgers<T extends User$ledgersArgs<ExtArgs> = {}>(args?: Subset<T, User$ledgersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    banks<T extends User$banksArgs<ExtArgs> = {}>(args?: Subset<T, User$banksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BankPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    matched<T extends User$matchedArgs<ExtArgs> = {}>(args?: Subset<T, User$matchedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchedPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    processedEmails<T extends User$processedEmailsArgs<ExtArgs> = {}>(args?: Subset<T, User$processedEmailsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessedEmailPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.ledgers
   */
  export type User$ledgersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ledger
     */
    select?: LedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ledger
     */
    omit?: LedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerInclude<ExtArgs> | null
    where?: LedgerWhereInput
    orderBy?: LedgerOrderByWithRelationInput | LedgerOrderByWithRelationInput[]
    cursor?: LedgerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LedgerScalarFieldEnum | LedgerScalarFieldEnum[]
  }

  /**
   * User.banks
   */
  export type User$banksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bank
     */
    select?: BankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bank
     */
    omit?: BankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankInclude<ExtArgs> | null
    where?: BankWhereInput
    orderBy?: BankOrderByWithRelationInput | BankOrderByWithRelationInput[]
    cursor?: BankWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BankScalarFieldEnum | BankScalarFieldEnum[]
  }

  /**
   * User.matched
   */
  export type User$matchedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Matched
     */
    select?: MatchedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Matched
     */
    omit?: MatchedOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchedInclude<ExtArgs> | null
    where?: MatchedWhereInput
    orderBy?: MatchedOrderByWithRelationInput | MatchedOrderByWithRelationInput[]
    cursor?: MatchedWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchedScalarFieldEnum | MatchedScalarFieldEnum[]
  }

  /**
   * User.processedEmails
   */
  export type User$processedEmailsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEmail
     */
    select?: ProcessedEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEmail
     */
    omit?: ProcessedEmailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedEmailInclude<ExtArgs> | null
    where?: ProcessedEmailWhereInput
    orderBy?: ProcessedEmailOrderByWithRelationInput | ProcessedEmailOrderByWithRelationInput[]
    cursor?: ProcessedEmailWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProcessedEmailScalarFieldEnum | ProcessedEmailScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Ledger
   */

  export type AggregateLedger = {
    _count: LedgerCountAggregateOutputType | null
    _avg: LedgerAvgAggregateOutputType | null
    _sum: LedgerSumAggregateOutputType | null
    _min: LedgerMinAggregateOutputType | null
    _max: LedgerMaxAggregateOutputType | null
  }

  export type LedgerAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type LedgerSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type LedgerMinAggregateOutputType = {
    id: string | null
    userEmail: string | null
    date: Date | null
    description: string | null
    amount: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LedgerMaxAggregateOutputType = {
    id: string | null
    userEmail: string | null
    date: Date | null
    description: string | null
    amount: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LedgerCountAggregateOutputType = {
    id: number
    userEmail: number
    date: number
    description: number
    amount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LedgerAvgAggregateInputType = {
    amount?: true
  }

  export type LedgerSumAggregateInputType = {
    amount?: true
  }

  export type LedgerMinAggregateInputType = {
    id?: true
    userEmail?: true
    date?: true
    description?: true
    amount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LedgerMaxAggregateInputType = {
    id?: true
    userEmail?: true
    date?: true
    description?: true
    amount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LedgerCountAggregateInputType = {
    id?: true
    userEmail?: true
    date?: true
    description?: true
    amount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LedgerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ledger to aggregate.
     */
    where?: LedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ledgers to fetch.
     */
    orderBy?: LedgerOrderByWithRelationInput | LedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ledgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ledgers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ledgers
    **/
    _count?: true | LedgerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LedgerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LedgerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LedgerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LedgerMaxAggregateInputType
  }

  export type GetLedgerAggregateType<T extends LedgerAggregateArgs> = {
        [P in keyof T & keyof AggregateLedger]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLedger[P]>
      : GetScalarType<T[P], AggregateLedger[P]>
  }




  export type LedgerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LedgerWhereInput
    orderBy?: LedgerOrderByWithAggregationInput | LedgerOrderByWithAggregationInput[]
    by: LedgerScalarFieldEnum[] | LedgerScalarFieldEnum
    having?: LedgerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LedgerCountAggregateInputType | true
    _avg?: LedgerAvgAggregateInputType
    _sum?: LedgerSumAggregateInputType
    _min?: LedgerMinAggregateInputType
    _max?: LedgerMaxAggregateInputType
  }

  export type LedgerGroupByOutputType = {
    id: string
    userEmail: string
    date: Date
    description: string
    amount: Decimal
    createdAt: Date
    updatedAt: Date
    _count: LedgerCountAggregateOutputType | null
    _avg: LedgerAvgAggregateOutputType | null
    _sum: LedgerSumAggregateOutputType | null
    _min: LedgerMinAggregateOutputType | null
    _max: LedgerMaxAggregateOutputType | null
  }

  type GetLedgerGroupByPayload<T extends LedgerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LedgerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LedgerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LedgerGroupByOutputType[P]>
            : GetScalarType<T[P], LedgerGroupByOutputType[P]>
        }
      >
    >


  export type LedgerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userEmail?: boolean
    date?: boolean
    description?: boolean
    amount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    matched?: boolean | Ledger$matchedArgs<ExtArgs>
    _count?: boolean | LedgerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ledger"]>

  export type LedgerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userEmail?: boolean
    date?: boolean
    description?: boolean
    amount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ledger"]>

  export type LedgerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userEmail?: boolean
    date?: boolean
    description?: boolean
    amount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ledger"]>

  export type LedgerSelectScalar = {
    id?: boolean
    userEmail?: boolean
    date?: boolean
    description?: boolean
    amount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LedgerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userEmail" | "date" | "description" | "amount" | "createdAt" | "updatedAt", ExtArgs["result"]["ledger"]>
  export type LedgerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    matched?: boolean | Ledger$matchedArgs<ExtArgs>
    _count?: boolean | LedgerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LedgerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LedgerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $LedgerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ledger"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      matched: Prisma.$MatchedPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userEmail: string
      date: Date
      description: string
      amount: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ledger"]>
    composites: {}
  }

  type LedgerGetPayload<S extends boolean | null | undefined | LedgerDefaultArgs> = $Result.GetResult<Prisma.$LedgerPayload, S>

  type LedgerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LedgerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LedgerCountAggregateInputType | true
    }

  export interface LedgerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ledger'], meta: { name: 'Ledger' } }
    /**
     * Find zero or one Ledger that matches the filter.
     * @param {LedgerFindUniqueArgs} args - Arguments to find a Ledger
     * @example
     * // Get one Ledger
     * const ledger = await prisma.ledger.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LedgerFindUniqueArgs>(args: SelectSubset<T, LedgerFindUniqueArgs<ExtArgs>>): Prisma__LedgerClient<$Result.GetResult<Prisma.$LedgerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ledger that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LedgerFindUniqueOrThrowArgs} args - Arguments to find a Ledger
     * @example
     * // Get one Ledger
     * const ledger = await prisma.ledger.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LedgerFindUniqueOrThrowArgs>(args: SelectSubset<T, LedgerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LedgerClient<$Result.GetResult<Prisma.$LedgerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ledger that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerFindFirstArgs} args - Arguments to find a Ledger
     * @example
     * // Get one Ledger
     * const ledger = await prisma.ledger.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LedgerFindFirstArgs>(args?: SelectSubset<T, LedgerFindFirstArgs<ExtArgs>>): Prisma__LedgerClient<$Result.GetResult<Prisma.$LedgerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ledger that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerFindFirstOrThrowArgs} args - Arguments to find a Ledger
     * @example
     * // Get one Ledger
     * const ledger = await prisma.ledger.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LedgerFindFirstOrThrowArgs>(args?: SelectSubset<T, LedgerFindFirstOrThrowArgs<ExtArgs>>): Prisma__LedgerClient<$Result.GetResult<Prisma.$LedgerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Ledgers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ledgers
     * const ledgers = await prisma.ledger.findMany()
     * 
     * // Get first 10 Ledgers
     * const ledgers = await prisma.ledger.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ledgerWithIdOnly = await prisma.ledger.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LedgerFindManyArgs>(args?: SelectSubset<T, LedgerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ledger.
     * @param {LedgerCreateArgs} args - Arguments to create a Ledger.
     * @example
     * // Create one Ledger
     * const Ledger = await prisma.ledger.create({
     *   data: {
     *     // ... data to create a Ledger
     *   }
     * })
     * 
     */
    create<T extends LedgerCreateArgs>(args: SelectSubset<T, LedgerCreateArgs<ExtArgs>>): Prisma__LedgerClient<$Result.GetResult<Prisma.$LedgerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Ledgers.
     * @param {LedgerCreateManyArgs} args - Arguments to create many Ledgers.
     * @example
     * // Create many Ledgers
     * const ledger = await prisma.ledger.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LedgerCreateManyArgs>(args?: SelectSubset<T, LedgerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ledgers and returns the data saved in the database.
     * @param {LedgerCreateManyAndReturnArgs} args - Arguments to create many Ledgers.
     * @example
     * // Create many Ledgers
     * const ledger = await prisma.ledger.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ledgers and only return the `id`
     * const ledgerWithIdOnly = await prisma.ledger.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LedgerCreateManyAndReturnArgs>(args?: SelectSubset<T, LedgerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Ledger.
     * @param {LedgerDeleteArgs} args - Arguments to delete one Ledger.
     * @example
     * // Delete one Ledger
     * const Ledger = await prisma.ledger.delete({
     *   where: {
     *     // ... filter to delete one Ledger
     *   }
     * })
     * 
     */
    delete<T extends LedgerDeleteArgs>(args: SelectSubset<T, LedgerDeleteArgs<ExtArgs>>): Prisma__LedgerClient<$Result.GetResult<Prisma.$LedgerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ledger.
     * @param {LedgerUpdateArgs} args - Arguments to update one Ledger.
     * @example
     * // Update one Ledger
     * const ledger = await prisma.ledger.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LedgerUpdateArgs>(args: SelectSubset<T, LedgerUpdateArgs<ExtArgs>>): Prisma__LedgerClient<$Result.GetResult<Prisma.$LedgerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Ledgers.
     * @param {LedgerDeleteManyArgs} args - Arguments to filter Ledgers to delete.
     * @example
     * // Delete a few Ledgers
     * const { count } = await prisma.ledger.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LedgerDeleteManyArgs>(args?: SelectSubset<T, LedgerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ledgers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ledgers
     * const ledger = await prisma.ledger.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LedgerUpdateManyArgs>(args: SelectSubset<T, LedgerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ledgers and returns the data updated in the database.
     * @param {LedgerUpdateManyAndReturnArgs} args - Arguments to update many Ledgers.
     * @example
     * // Update many Ledgers
     * const ledger = await prisma.ledger.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Ledgers and only return the `id`
     * const ledgerWithIdOnly = await prisma.ledger.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LedgerUpdateManyAndReturnArgs>(args: SelectSubset<T, LedgerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Ledger.
     * @param {LedgerUpsertArgs} args - Arguments to update or create a Ledger.
     * @example
     * // Update or create a Ledger
     * const ledger = await prisma.ledger.upsert({
     *   create: {
     *     // ... data to create a Ledger
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ledger we want to update
     *   }
     * })
     */
    upsert<T extends LedgerUpsertArgs>(args: SelectSubset<T, LedgerUpsertArgs<ExtArgs>>): Prisma__LedgerClient<$Result.GetResult<Prisma.$LedgerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Ledgers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerCountArgs} args - Arguments to filter Ledgers to count.
     * @example
     * // Count the number of Ledgers
     * const count = await prisma.ledger.count({
     *   where: {
     *     // ... the filter for the Ledgers we want to count
     *   }
     * })
    **/
    count<T extends LedgerCountArgs>(
      args?: Subset<T, LedgerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LedgerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ledger.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LedgerAggregateArgs>(args: Subset<T, LedgerAggregateArgs>): Prisma.PrismaPromise<GetLedgerAggregateType<T>>

    /**
     * Group by Ledger.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LedgerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LedgerGroupByArgs['orderBy'] }
        : { orderBy?: LedgerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LedgerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLedgerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ledger model
   */
  readonly fields: LedgerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ledger.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LedgerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    matched<T extends Ledger$matchedArgs<ExtArgs> = {}>(args?: Subset<T, Ledger$matchedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchedPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Ledger model
   */
  interface LedgerFieldRefs {
    readonly id: FieldRef<"Ledger", 'String'>
    readonly userEmail: FieldRef<"Ledger", 'String'>
    readonly date: FieldRef<"Ledger", 'DateTime'>
    readonly description: FieldRef<"Ledger", 'String'>
    readonly amount: FieldRef<"Ledger", 'Decimal'>
    readonly createdAt: FieldRef<"Ledger", 'DateTime'>
    readonly updatedAt: FieldRef<"Ledger", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ledger findUnique
   */
  export type LedgerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ledger
     */
    select?: LedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ledger
     */
    omit?: LedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerInclude<ExtArgs> | null
    /**
     * Filter, which Ledger to fetch.
     */
    where: LedgerWhereUniqueInput
  }

  /**
   * Ledger findUniqueOrThrow
   */
  export type LedgerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ledger
     */
    select?: LedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ledger
     */
    omit?: LedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerInclude<ExtArgs> | null
    /**
     * Filter, which Ledger to fetch.
     */
    where: LedgerWhereUniqueInput
  }

  /**
   * Ledger findFirst
   */
  export type LedgerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ledger
     */
    select?: LedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ledger
     */
    omit?: LedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerInclude<ExtArgs> | null
    /**
     * Filter, which Ledger to fetch.
     */
    where?: LedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ledgers to fetch.
     */
    orderBy?: LedgerOrderByWithRelationInput | LedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ledgers.
     */
    cursor?: LedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ledgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ledgers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ledgers.
     */
    distinct?: LedgerScalarFieldEnum | LedgerScalarFieldEnum[]
  }

  /**
   * Ledger findFirstOrThrow
   */
  export type LedgerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ledger
     */
    select?: LedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ledger
     */
    omit?: LedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerInclude<ExtArgs> | null
    /**
     * Filter, which Ledger to fetch.
     */
    where?: LedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ledgers to fetch.
     */
    orderBy?: LedgerOrderByWithRelationInput | LedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ledgers.
     */
    cursor?: LedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ledgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ledgers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ledgers.
     */
    distinct?: LedgerScalarFieldEnum | LedgerScalarFieldEnum[]
  }

  /**
   * Ledger findMany
   */
  export type LedgerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ledger
     */
    select?: LedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ledger
     */
    omit?: LedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerInclude<ExtArgs> | null
    /**
     * Filter, which Ledgers to fetch.
     */
    where?: LedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ledgers to fetch.
     */
    orderBy?: LedgerOrderByWithRelationInput | LedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ledgers.
     */
    cursor?: LedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ledgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ledgers.
     */
    skip?: number
    distinct?: LedgerScalarFieldEnum | LedgerScalarFieldEnum[]
  }

  /**
   * Ledger create
   */
  export type LedgerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ledger
     */
    select?: LedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ledger
     */
    omit?: LedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerInclude<ExtArgs> | null
    /**
     * The data needed to create a Ledger.
     */
    data: XOR<LedgerCreateInput, LedgerUncheckedCreateInput>
  }

  /**
   * Ledger createMany
   */
  export type LedgerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ledgers.
     */
    data: LedgerCreateManyInput | LedgerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Ledger createManyAndReturn
   */
  export type LedgerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ledger
     */
    select?: LedgerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ledger
     */
    omit?: LedgerOmit<ExtArgs> | null
    /**
     * The data used to create many Ledgers.
     */
    data: LedgerCreateManyInput | LedgerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ledger update
   */
  export type LedgerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ledger
     */
    select?: LedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ledger
     */
    omit?: LedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerInclude<ExtArgs> | null
    /**
     * The data needed to update a Ledger.
     */
    data: XOR<LedgerUpdateInput, LedgerUncheckedUpdateInput>
    /**
     * Choose, which Ledger to update.
     */
    where: LedgerWhereUniqueInput
  }

  /**
   * Ledger updateMany
   */
  export type LedgerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ledgers.
     */
    data: XOR<LedgerUpdateManyMutationInput, LedgerUncheckedUpdateManyInput>
    /**
     * Filter which Ledgers to update
     */
    where?: LedgerWhereInput
    /**
     * Limit how many Ledgers to update.
     */
    limit?: number
  }

  /**
   * Ledger updateManyAndReturn
   */
  export type LedgerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ledger
     */
    select?: LedgerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ledger
     */
    omit?: LedgerOmit<ExtArgs> | null
    /**
     * The data used to update Ledgers.
     */
    data: XOR<LedgerUpdateManyMutationInput, LedgerUncheckedUpdateManyInput>
    /**
     * Filter which Ledgers to update
     */
    where?: LedgerWhereInput
    /**
     * Limit how many Ledgers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ledger upsert
   */
  export type LedgerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ledger
     */
    select?: LedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ledger
     */
    omit?: LedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerInclude<ExtArgs> | null
    /**
     * The filter to search for the Ledger to update in case it exists.
     */
    where: LedgerWhereUniqueInput
    /**
     * In case the Ledger found by the `where` argument doesn't exist, create a new Ledger with this data.
     */
    create: XOR<LedgerCreateInput, LedgerUncheckedCreateInput>
    /**
     * In case the Ledger was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LedgerUpdateInput, LedgerUncheckedUpdateInput>
  }

  /**
   * Ledger delete
   */
  export type LedgerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ledger
     */
    select?: LedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ledger
     */
    omit?: LedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerInclude<ExtArgs> | null
    /**
     * Filter which Ledger to delete.
     */
    where: LedgerWhereUniqueInput
  }

  /**
   * Ledger deleteMany
   */
  export type LedgerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ledgers to delete
     */
    where?: LedgerWhereInput
    /**
     * Limit how many Ledgers to delete.
     */
    limit?: number
  }

  /**
   * Ledger.matched
   */
  export type Ledger$matchedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Matched
     */
    select?: MatchedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Matched
     */
    omit?: MatchedOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchedInclude<ExtArgs> | null
    where?: MatchedWhereInput
    orderBy?: MatchedOrderByWithRelationInput | MatchedOrderByWithRelationInput[]
    cursor?: MatchedWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchedScalarFieldEnum | MatchedScalarFieldEnum[]
  }

  /**
   * Ledger without action
   */
  export type LedgerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ledger
     */
    select?: LedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ledger
     */
    omit?: LedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerInclude<ExtArgs> | null
  }


  /**
   * Model Bank
   */

  export type AggregateBank = {
    _count: BankCountAggregateOutputType | null
    _avg: BankAvgAggregateOutputType | null
    _sum: BankSumAggregateOutputType | null
    _min: BankMinAggregateOutputType | null
    _max: BankMaxAggregateOutputType | null
  }

  export type BankAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type BankSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type BankMinAggregateOutputType = {
    id: string | null
    userEmail: string | null
    date: Date | null
    description: string | null
    amount: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BankMaxAggregateOutputType = {
    id: string | null
    userEmail: string | null
    date: Date | null
    description: string | null
    amount: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BankCountAggregateOutputType = {
    id: number
    userEmail: number
    date: number
    description: number
    amount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BankAvgAggregateInputType = {
    amount?: true
  }

  export type BankSumAggregateInputType = {
    amount?: true
  }

  export type BankMinAggregateInputType = {
    id?: true
    userEmail?: true
    date?: true
    description?: true
    amount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BankMaxAggregateInputType = {
    id?: true
    userEmail?: true
    date?: true
    description?: true
    amount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BankCountAggregateInputType = {
    id?: true
    userEmail?: true
    date?: true
    description?: true
    amount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BankAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bank to aggregate.
     */
    where?: BankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Banks to fetch.
     */
    orderBy?: BankOrderByWithRelationInput | BankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Banks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Banks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Banks
    **/
    _count?: true | BankCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BankAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BankSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BankMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BankMaxAggregateInputType
  }

  export type GetBankAggregateType<T extends BankAggregateArgs> = {
        [P in keyof T & keyof AggregateBank]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBank[P]>
      : GetScalarType<T[P], AggregateBank[P]>
  }




  export type BankGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BankWhereInput
    orderBy?: BankOrderByWithAggregationInput | BankOrderByWithAggregationInput[]
    by: BankScalarFieldEnum[] | BankScalarFieldEnum
    having?: BankScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BankCountAggregateInputType | true
    _avg?: BankAvgAggregateInputType
    _sum?: BankSumAggregateInputType
    _min?: BankMinAggregateInputType
    _max?: BankMaxAggregateInputType
  }

  export type BankGroupByOutputType = {
    id: string
    userEmail: string
    date: Date
    description: string
    amount: Decimal
    createdAt: Date
    updatedAt: Date
    _count: BankCountAggregateOutputType | null
    _avg: BankAvgAggregateOutputType | null
    _sum: BankSumAggregateOutputType | null
    _min: BankMinAggregateOutputType | null
    _max: BankMaxAggregateOutputType | null
  }

  type GetBankGroupByPayload<T extends BankGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BankGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BankGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BankGroupByOutputType[P]>
            : GetScalarType<T[P], BankGroupByOutputType[P]>
        }
      >
    >


  export type BankSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userEmail?: boolean
    date?: boolean
    description?: boolean
    amount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    matched?: boolean | Bank$matchedArgs<ExtArgs>
    _count?: boolean | BankCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bank"]>

  export type BankSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userEmail?: boolean
    date?: boolean
    description?: boolean
    amount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bank"]>

  export type BankSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userEmail?: boolean
    date?: boolean
    description?: boolean
    amount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bank"]>

  export type BankSelectScalar = {
    id?: boolean
    userEmail?: boolean
    date?: boolean
    description?: boolean
    amount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BankOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userEmail" | "date" | "description" | "amount" | "createdAt" | "updatedAt", ExtArgs["result"]["bank"]>
  export type BankInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    matched?: boolean | Bank$matchedArgs<ExtArgs>
    _count?: boolean | BankCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BankIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type BankIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $BankPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Bank"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      matched: Prisma.$MatchedPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userEmail: string
      date: Date
      description: string
      amount: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["bank"]>
    composites: {}
  }

  type BankGetPayload<S extends boolean | null | undefined | BankDefaultArgs> = $Result.GetResult<Prisma.$BankPayload, S>

  type BankCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BankFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BankCountAggregateInputType | true
    }

  export interface BankDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Bank'], meta: { name: 'Bank' } }
    /**
     * Find zero or one Bank that matches the filter.
     * @param {BankFindUniqueArgs} args - Arguments to find a Bank
     * @example
     * // Get one Bank
     * const bank = await prisma.bank.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BankFindUniqueArgs>(args: SelectSubset<T, BankFindUniqueArgs<ExtArgs>>): Prisma__BankClient<$Result.GetResult<Prisma.$BankPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bank that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BankFindUniqueOrThrowArgs} args - Arguments to find a Bank
     * @example
     * // Get one Bank
     * const bank = await prisma.bank.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BankFindUniqueOrThrowArgs>(args: SelectSubset<T, BankFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BankClient<$Result.GetResult<Prisma.$BankPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bank that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BankFindFirstArgs} args - Arguments to find a Bank
     * @example
     * // Get one Bank
     * const bank = await prisma.bank.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BankFindFirstArgs>(args?: SelectSubset<T, BankFindFirstArgs<ExtArgs>>): Prisma__BankClient<$Result.GetResult<Prisma.$BankPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bank that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BankFindFirstOrThrowArgs} args - Arguments to find a Bank
     * @example
     * // Get one Bank
     * const bank = await prisma.bank.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BankFindFirstOrThrowArgs>(args?: SelectSubset<T, BankFindFirstOrThrowArgs<ExtArgs>>): Prisma__BankClient<$Result.GetResult<Prisma.$BankPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Banks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BankFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Banks
     * const banks = await prisma.bank.findMany()
     * 
     * // Get first 10 Banks
     * const banks = await prisma.bank.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bankWithIdOnly = await prisma.bank.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BankFindManyArgs>(args?: SelectSubset<T, BankFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BankPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bank.
     * @param {BankCreateArgs} args - Arguments to create a Bank.
     * @example
     * // Create one Bank
     * const Bank = await prisma.bank.create({
     *   data: {
     *     // ... data to create a Bank
     *   }
     * })
     * 
     */
    create<T extends BankCreateArgs>(args: SelectSubset<T, BankCreateArgs<ExtArgs>>): Prisma__BankClient<$Result.GetResult<Prisma.$BankPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Banks.
     * @param {BankCreateManyArgs} args - Arguments to create many Banks.
     * @example
     * // Create many Banks
     * const bank = await prisma.bank.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BankCreateManyArgs>(args?: SelectSubset<T, BankCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Banks and returns the data saved in the database.
     * @param {BankCreateManyAndReturnArgs} args - Arguments to create many Banks.
     * @example
     * // Create many Banks
     * const bank = await prisma.bank.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Banks and only return the `id`
     * const bankWithIdOnly = await prisma.bank.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BankCreateManyAndReturnArgs>(args?: SelectSubset<T, BankCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BankPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Bank.
     * @param {BankDeleteArgs} args - Arguments to delete one Bank.
     * @example
     * // Delete one Bank
     * const Bank = await prisma.bank.delete({
     *   where: {
     *     // ... filter to delete one Bank
     *   }
     * })
     * 
     */
    delete<T extends BankDeleteArgs>(args: SelectSubset<T, BankDeleteArgs<ExtArgs>>): Prisma__BankClient<$Result.GetResult<Prisma.$BankPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bank.
     * @param {BankUpdateArgs} args - Arguments to update one Bank.
     * @example
     * // Update one Bank
     * const bank = await prisma.bank.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BankUpdateArgs>(args: SelectSubset<T, BankUpdateArgs<ExtArgs>>): Prisma__BankClient<$Result.GetResult<Prisma.$BankPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Banks.
     * @param {BankDeleteManyArgs} args - Arguments to filter Banks to delete.
     * @example
     * // Delete a few Banks
     * const { count } = await prisma.bank.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BankDeleteManyArgs>(args?: SelectSubset<T, BankDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Banks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BankUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Banks
     * const bank = await prisma.bank.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BankUpdateManyArgs>(args: SelectSubset<T, BankUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Banks and returns the data updated in the database.
     * @param {BankUpdateManyAndReturnArgs} args - Arguments to update many Banks.
     * @example
     * // Update many Banks
     * const bank = await prisma.bank.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Banks and only return the `id`
     * const bankWithIdOnly = await prisma.bank.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BankUpdateManyAndReturnArgs>(args: SelectSubset<T, BankUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BankPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Bank.
     * @param {BankUpsertArgs} args - Arguments to update or create a Bank.
     * @example
     * // Update or create a Bank
     * const bank = await prisma.bank.upsert({
     *   create: {
     *     // ... data to create a Bank
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bank we want to update
     *   }
     * })
     */
    upsert<T extends BankUpsertArgs>(args: SelectSubset<T, BankUpsertArgs<ExtArgs>>): Prisma__BankClient<$Result.GetResult<Prisma.$BankPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Banks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BankCountArgs} args - Arguments to filter Banks to count.
     * @example
     * // Count the number of Banks
     * const count = await prisma.bank.count({
     *   where: {
     *     // ... the filter for the Banks we want to count
     *   }
     * })
    **/
    count<T extends BankCountArgs>(
      args?: Subset<T, BankCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BankCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bank.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BankAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BankAggregateArgs>(args: Subset<T, BankAggregateArgs>): Prisma.PrismaPromise<GetBankAggregateType<T>>

    /**
     * Group by Bank.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BankGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BankGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BankGroupByArgs['orderBy'] }
        : { orderBy?: BankGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BankGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBankGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Bank model
   */
  readonly fields: BankFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Bank.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BankClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    matched<T extends Bank$matchedArgs<ExtArgs> = {}>(args?: Subset<T, Bank$matchedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchedPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Bank model
   */
  interface BankFieldRefs {
    readonly id: FieldRef<"Bank", 'String'>
    readonly userEmail: FieldRef<"Bank", 'String'>
    readonly date: FieldRef<"Bank", 'DateTime'>
    readonly description: FieldRef<"Bank", 'String'>
    readonly amount: FieldRef<"Bank", 'Decimal'>
    readonly createdAt: FieldRef<"Bank", 'DateTime'>
    readonly updatedAt: FieldRef<"Bank", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Bank findUnique
   */
  export type BankFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bank
     */
    select?: BankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bank
     */
    omit?: BankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankInclude<ExtArgs> | null
    /**
     * Filter, which Bank to fetch.
     */
    where: BankWhereUniqueInput
  }

  /**
   * Bank findUniqueOrThrow
   */
  export type BankFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bank
     */
    select?: BankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bank
     */
    omit?: BankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankInclude<ExtArgs> | null
    /**
     * Filter, which Bank to fetch.
     */
    where: BankWhereUniqueInput
  }

  /**
   * Bank findFirst
   */
  export type BankFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bank
     */
    select?: BankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bank
     */
    omit?: BankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankInclude<ExtArgs> | null
    /**
     * Filter, which Bank to fetch.
     */
    where?: BankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Banks to fetch.
     */
    orderBy?: BankOrderByWithRelationInput | BankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Banks.
     */
    cursor?: BankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Banks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Banks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Banks.
     */
    distinct?: BankScalarFieldEnum | BankScalarFieldEnum[]
  }

  /**
   * Bank findFirstOrThrow
   */
  export type BankFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bank
     */
    select?: BankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bank
     */
    omit?: BankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankInclude<ExtArgs> | null
    /**
     * Filter, which Bank to fetch.
     */
    where?: BankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Banks to fetch.
     */
    orderBy?: BankOrderByWithRelationInput | BankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Banks.
     */
    cursor?: BankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Banks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Banks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Banks.
     */
    distinct?: BankScalarFieldEnum | BankScalarFieldEnum[]
  }

  /**
   * Bank findMany
   */
  export type BankFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bank
     */
    select?: BankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bank
     */
    omit?: BankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankInclude<ExtArgs> | null
    /**
     * Filter, which Banks to fetch.
     */
    where?: BankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Banks to fetch.
     */
    orderBy?: BankOrderByWithRelationInput | BankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Banks.
     */
    cursor?: BankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Banks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Banks.
     */
    skip?: number
    distinct?: BankScalarFieldEnum | BankScalarFieldEnum[]
  }

  /**
   * Bank create
   */
  export type BankCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bank
     */
    select?: BankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bank
     */
    omit?: BankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankInclude<ExtArgs> | null
    /**
     * The data needed to create a Bank.
     */
    data: XOR<BankCreateInput, BankUncheckedCreateInput>
  }

  /**
   * Bank createMany
   */
  export type BankCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Banks.
     */
    data: BankCreateManyInput | BankCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Bank createManyAndReturn
   */
  export type BankCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bank
     */
    select?: BankSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bank
     */
    omit?: BankOmit<ExtArgs> | null
    /**
     * The data used to create many Banks.
     */
    data: BankCreateManyInput | BankCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bank update
   */
  export type BankUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bank
     */
    select?: BankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bank
     */
    omit?: BankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankInclude<ExtArgs> | null
    /**
     * The data needed to update a Bank.
     */
    data: XOR<BankUpdateInput, BankUncheckedUpdateInput>
    /**
     * Choose, which Bank to update.
     */
    where: BankWhereUniqueInput
  }

  /**
   * Bank updateMany
   */
  export type BankUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Banks.
     */
    data: XOR<BankUpdateManyMutationInput, BankUncheckedUpdateManyInput>
    /**
     * Filter which Banks to update
     */
    where?: BankWhereInput
    /**
     * Limit how many Banks to update.
     */
    limit?: number
  }

  /**
   * Bank updateManyAndReturn
   */
  export type BankUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bank
     */
    select?: BankSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bank
     */
    omit?: BankOmit<ExtArgs> | null
    /**
     * The data used to update Banks.
     */
    data: XOR<BankUpdateManyMutationInput, BankUncheckedUpdateManyInput>
    /**
     * Filter which Banks to update
     */
    where?: BankWhereInput
    /**
     * Limit how many Banks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bank upsert
   */
  export type BankUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bank
     */
    select?: BankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bank
     */
    omit?: BankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankInclude<ExtArgs> | null
    /**
     * The filter to search for the Bank to update in case it exists.
     */
    where: BankWhereUniqueInput
    /**
     * In case the Bank found by the `where` argument doesn't exist, create a new Bank with this data.
     */
    create: XOR<BankCreateInput, BankUncheckedCreateInput>
    /**
     * In case the Bank was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BankUpdateInput, BankUncheckedUpdateInput>
  }

  /**
   * Bank delete
   */
  export type BankDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bank
     */
    select?: BankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bank
     */
    omit?: BankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankInclude<ExtArgs> | null
    /**
     * Filter which Bank to delete.
     */
    where: BankWhereUniqueInput
  }

  /**
   * Bank deleteMany
   */
  export type BankDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Banks to delete
     */
    where?: BankWhereInput
    /**
     * Limit how many Banks to delete.
     */
    limit?: number
  }

  /**
   * Bank.matched
   */
  export type Bank$matchedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Matched
     */
    select?: MatchedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Matched
     */
    omit?: MatchedOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchedInclude<ExtArgs> | null
    where?: MatchedWhereInput
    orderBy?: MatchedOrderByWithRelationInput | MatchedOrderByWithRelationInput[]
    cursor?: MatchedWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchedScalarFieldEnum | MatchedScalarFieldEnum[]
  }

  /**
   * Bank without action
   */
  export type BankDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bank
     */
    select?: BankSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bank
     */
    omit?: BankOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankInclude<ExtArgs> | null
  }


  /**
   * Model Matched
   */

  export type AggregateMatched = {
    _count: MatchedCountAggregateOutputType | null
    _avg: MatchedAvgAggregateOutputType | null
    _sum: MatchedSumAggregateOutputType | null
    _min: MatchedMinAggregateOutputType | null
    _max: MatchedMaxAggregateOutputType | null
  }

  export type MatchedAvgAggregateOutputType = {
    amount: Decimal | null
    matchScore: number | null
  }

  export type MatchedSumAggregateOutputType = {
    amount: Decimal | null
    matchScore: number | null
  }

  export type MatchedMinAggregateOutputType = {
    id: string | null
    userEmail: string | null
    ledgerId: string | null
    bankId: string | null
    bankTransaction: string | null
    description: string | null
    amount: Decimal | null
    date: Date | null
    matchScore: number | null
    createdAt: Date | null
  }

  export type MatchedMaxAggregateOutputType = {
    id: string | null
    userEmail: string | null
    ledgerId: string | null
    bankId: string | null
    bankTransaction: string | null
    description: string | null
    amount: Decimal | null
    date: Date | null
    matchScore: number | null
    createdAt: Date | null
  }

  export type MatchedCountAggregateOutputType = {
    id: number
    userEmail: number
    ledgerId: number
    bankId: number
    bankTransaction: number
    description: number
    amount: number
    date: number
    matchScore: number
    createdAt: number
    _all: number
  }


  export type MatchedAvgAggregateInputType = {
    amount?: true
    matchScore?: true
  }

  export type MatchedSumAggregateInputType = {
    amount?: true
    matchScore?: true
  }

  export type MatchedMinAggregateInputType = {
    id?: true
    userEmail?: true
    ledgerId?: true
    bankId?: true
    bankTransaction?: true
    description?: true
    amount?: true
    date?: true
    matchScore?: true
    createdAt?: true
  }

  export type MatchedMaxAggregateInputType = {
    id?: true
    userEmail?: true
    ledgerId?: true
    bankId?: true
    bankTransaction?: true
    description?: true
    amount?: true
    date?: true
    matchScore?: true
    createdAt?: true
  }

  export type MatchedCountAggregateInputType = {
    id?: true
    userEmail?: true
    ledgerId?: true
    bankId?: true
    bankTransaction?: true
    description?: true
    amount?: true
    date?: true
    matchScore?: true
    createdAt?: true
    _all?: true
  }

  export type MatchedAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Matched to aggregate.
     */
    where?: MatchedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matcheds to fetch.
     */
    orderBy?: MatchedOrderByWithRelationInput | MatchedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matcheds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matcheds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Matcheds
    **/
    _count?: true | MatchedCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MatchedAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MatchedSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchedMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchedMaxAggregateInputType
  }

  export type GetMatchedAggregateType<T extends MatchedAggregateArgs> = {
        [P in keyof T & keyof AggregateMatched]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatched[P]>
      : GetScalarType<T[P], AggregateMatched[P]>
  }




  export type MatchedGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchedWhereInput
    orderBy?: MatchedOrderByWithAggregationInput | MatchedOrderByWithAggregationInput[]
    by: MatchedScalarFieldEnum[] | MatchedScalarFieldEnum
    having?: MatchedScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchedCountAggregateInputType | true
    _avg?: MatchedAvgAggregateInputType
    _sum?: MatchedSumAggregateInputType
    _min?: MatchedMinAggregateInputType
    _max?: MatchedMaxAggregateInputType
  }

  export type MatchedGroupByOutputType = {
    id: string
    userEmail: string
    ledgerId: string
    bankId: string
    bankTransaction: string
    description: string
    amount: Decimal
    date: Date
    matchScore: number
    createdAt: Date
    _count: MatchedCountAggregateOutputType | null
    _avg: MatchedAvgAggregateOutputType | null
    _sum: MatchedSumAggregateOutputType | null
    _min: MatchedMinAggregateOutputType | null
    _max: MatchedMaxAggregateOutputType | null
  }

  type GetMatchedGroupByPayload<T extends MatchedGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchedGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchedGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchedGroupByOutputType[P]>
            : GetScalarType<T[P], MatchedGroupByOutputType[P]>
        }
      >
    >


  export type MatchedSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userEmail?: boolean
    ledgerId?: boolean
    bankId?: boolean
    bankTransaction?: boolean
    description?: boolean
    amount?: boolean
    date?: boolean
    matchScore?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    ledger?: boolean | LedgerDefaultArgs<ExtArgs>
    bank?: boolean | BankDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matched"]>

  export type MatchedSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userEmail?: boolean
    ledgerId?: boolean
    bankId?: boolean
    bankTransaction?: boolean
    description?: boolean
    amount?: boolean
    date?: boolean
    matchScore?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    ledger?: boolean | LedgerDefaultArgs<ExtArgs>
    bank?: boolean | BankDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matched"]>

  export type MatchedSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userEmail?: boolean
    ledgerId?: boolean
    bankId?: boolean
    bankTransaction?: boolean
    description?: boolean
    amount?: boolean
    date?: boolean
    matchScore?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    ledger?: boolean | LedgerDefaultArgs<ExtArgs>
    bank?: boolean | BankDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matched"]>

  export type MatchedSelectScalar = {
    id?: boolean
    userEmail?: boolean
    ledgerId?: boolean
    bankId?: boolean
    bankTransaction?: boolean
    description?: boolean
    amount?: boolean
    date?: boolean
    matchScore?: boolean
    createdAt?: boolean
  }

  export type MatchedOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userEmail" | "ledgerId" | "bankId" | "bankTransaction" | "description" | "amount" | "date" | "matchScore" | "createdAt", ExtArgs["result"]["matched"]>
  export type MatchedInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    ledger?: boolean | LedgerDefaultArgs<ExtArgs>
    bank?: boolean | BankDefaultArgs<ExtArgs>
  }
  export type MatchedIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    ledger?: boolean | LedgerDefaultArgs<ExtArgs>
    bank?: boolean | BankDefaultArgs<ExtArgs>
  }
  export type MatchedIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    ledger?: boolean | LedgerDefaultArgs<ExtArgs>
    bank?: boolean | BankDefaultArgs<ExtArgs>
  }

  export type $MatchedPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Matched"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      ledger: Prisma.$LedgerPayload<ExtArgs>
      bank: Prisma.$BankPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userEmail: string
      ledgerId: string
      bankId: string
      bankTransaction: string
      description: string
      amount: Prisma.Decimal
      date: Date
      matchScore: number
      createdAt: Date
    }, ExtArgs["result"]["matched"]>
    composites: {}
  }

  type MatchedGetPayload<S extends boolean | null | undefined | MatchedDefaultArgs> = $Result.GetResult<Prisma.$MatchedPayload, S>

  type MatchedCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchedFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchedCountAggregateInputType | true
    }

  export interface MatchedDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Matched'], meta: { name: 'Matched' } }
    /**
     * Find zero or one Matched that matches the filter.
     * @param {MatchedFindUniqueArgs} args - Arguments to find a Matched
     * @example
     * // Get one Matched
     * const matched = await prisma.matched.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchedFindUniqueArgs>(args: SelectSubset<T, MatchedFindUniqueArgs<ExtArgs>>): Prisma__MatchedClient<$Result.GetResult<Prisma.$MatchedPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Matched that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchedFindUniqueOrThrowArgs} args - Arguments to find a Matched
     * @example
     * // Get one Matched
     * const matched = await prisma.matched.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchedFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchedFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchedClient<$Result.GetResult<Prisma.$MatchedPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Matched that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchedFindFirstArgs} args - Arguments to find a Matched
     * @example
     * // Get one Matched
     * const matched = await prisma.matched.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchedFindFirstArgs>(args?: SelectSubset<T, MatchedFindFirstArgs<ExtArgs>>): Prisma__MatchedClient<$Result.GetResult<Prisma.$MatchedPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Matched that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchedFindFirstOrThrowArgs} args - Arguments to find a Matched
     * @example
     * // Get one Matched
     * const matched = await prisma.matched.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchedFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchedFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchedClient<$Result.GetResult<Prisma.$MatchedPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Matcheds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchedFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Matcheds
     * const matcheds = await prisma.matched.findMany()
     * 
     * // Get first 10 Matcheds
     * const matcheds = await prisma.matched.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchedWithIdOnly = await prisma.matched.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchedFindManyArgs>(args?: SelectSubset<T, MatchedFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchedPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Matched.
     * @param {MatchedCreateArgs} args - Arguments to create a Matched.
     * @example
     * // Create one Matched
     * const Matched = await prisma.matched.create({
     *   data: {
     *     // ... data to create a Matched
     *   }
     * })
     * 
     */
    create<T extends MatchedCreateArgs>(args: SelectSubset<T, MatchedCreateArgs<ExtArgs>>): Prisma__MatchedClient<$Result.GetResult<Prisma.$MatchedPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Matcheds.
     * @param {MatchedCreateManyArgs} args - Arguments to create many Matcheds.
     * @example
     * // Create many Matcheds
     * const matched = await prisma.matched.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchedCreateManyArgs>(args?: SelectSubset<T, MatchedCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Matcheds and returns the data saved in the database.
     * @param {MatchedCreateManyAndReturnArgs} args - Arguments to create many Matcheds.
     * @example
     * // Create many Matcheds
     * const matched = await prisma.matched.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Matcheds and only return the `id`
     * const matchedWithIdOnly = await prisma.matched.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchedCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchedCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchedPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Matched.
     * @param {MatchedDeleteArgs} args - Arguments to delete one Matched.
     * @example
     * // Delete one Matched
     * const Matched = await prisma.matched.delete({
     *   where: {
     *     // ... filter to delete one Matched
     *   }
     * })
     * 
     */
    delete<T extends MatchedDeleteArgs>(args: SelectSubset<T, MatchedDeleteArgs<ExtArgs>>): Prisma__MatchedClient<$Result.GetResult<Prisma.$MatchedPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Matched.
     * @param {MatchedUpdateArgs} args - Arguments to update one Matched.
     * @example
     * // Update one Matched
     * const matched = await prisma.matched.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchedUpdateArgs>(args: SelectSubset<T, MatchedUpdateArgs<ExtArgs>>): Prisma__MatchedClient<$Result.GetResult<Prisma.$MatchedPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Matcheds.
     * @param {MatchedDeleteManyArgs} args - Arguments to filter Matcheds to delete.
     * @example
     * // Delete a few Matcheds
     * const { count } = await prisma.matched.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchedDeleteManyArgs>(args?: SelectSubset<T, MatchedDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matcheds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchedUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Matcheds
     * const matched = await prisma.matched.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchedUpdateManyArgs>(args: SelectSubset<T, MatchedUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matcheds and returns the data updated in the database.
     * @param {MatchedUpdateManyAndReturnArgs} args - Arguments to update many Matcheds.
     * @example
     * // Update many Matcheds
     * const matched = await prisma.matched.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Matcheds and only return the `id`
     * const matchedWithIdOnly = await prisma.matched.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MatchedUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchedUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchedPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Matched.
     * @param {MatchedUpsertArgs} args - Arguments to update or create a Matched.
     * @example
     * // Update or create a Matched
     * const matched = await prisma.matched.upsert({
     *   create: {
     *     // ... data to create a Matched
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Matched we want to update
     *   }
     * })
     */
    upsert<T extends MatchedUpsertArgs>(args: SelectSubset<T, MatchedUpsertArgs<ExtArgs>>): Prisma__MatchedClient<$Result.GetResult<Prisma.$MatchedPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Matcheds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchedCountArgs} args - Arguments to filter Matcheds to count.
     * @example
     * // Count the number of Matcheds
     * const count = await prisma.matched.count({
     *   where: {
     *     // ... the filter for the Matcheds we want to count
     *   }
     * })
    **/
    count<T extends MatchedCountArgs>(
      args?: Subset<T, MatchedCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchedCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Matched.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchedAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MatchedAggregateArgs>(args: Subset<T, MatchedAggregateArgs>): Prisma.PrismaPromise<GetMatchedAggregateType<T>>

    /**
     * Group by Matched.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchedGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MatchedGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchedGroupByArgs['orderBy'] }
        : { orderBy?: MatchedGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MatchedGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchedGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Matched model
   */
  readonly fields: MatchedFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Matched.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchedClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    ledger<T extends LedgerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LedgerDefaultArgs<ExtArgs>>): Prisma__LedgerClient<$Result.GetResult<Prisma.$LedgerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    bank<T extends BankDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BankDefaultArgs<ExtArgs>>): Prisma__BankClient<$Result.GetResult<Prisma.$BankPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Matched model
   */
  interface MatchedFieldRefs {
    readonly id: FieldRef<"Matched", 'String'>
    readonly userEmail: FieldRef<"Matched", 'String'>
    readonly ledgerId: FieldRef<"Matched", 'String'>
    readonly bankId: FieldRef<"Matched", 'String'>
    readonly bankTransaction: FieldRef<"Matched", 'String'>
    readonly description: FieldRef<"Matched", 'String'>
    readonly amount: FieldRef<"Matched", 'Decimal'>
    readonly date: FieldRef<"Matched", 'DateTime'>
    readonly matchScore: FieldRef<"Matched", 'Int'>
    readonly createdAt: FieldRef<"Matched", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Matched findUnique
   */
  export type MatchedFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Matched
     */
    select?: MatchedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Matched
     */
    omit?: MatchedOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchedInclude<ExtArgs> | null
    /**
     * Filter, which Matched to fetch.
     */
    where: MatchedWhereUniqueInput
  }

  /**
   * Matched findUniqueOrThrow
   */
  export type MatchedFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Matched
     */
    select?: MatchedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Matched
     */
    omit?: MatchedOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchedInclude<ExtArgs> | null
    /**
     * Filter, which Matched to fetch.
     */
    where: MatchedWhereUniqueInput
  }

  /**
   * Matched findFirst
   */
  export type MatchedFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Matched
     */
    select?: MatchedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Matched
     */
    omit?: MatchedOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchedInclude<ExtArgs> | null
    /**
     * Filter, which Matched to fetch.
     */
    where?: MatchedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matcheds to fetch.
     */
    orderBy?: MatchedOrderByWithRelationInput | MatchedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matcheds.
     */
    cursor?: MatchedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matcheds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matcheds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matcheds.
     */
    distinct?: MatchedScalarFieldEnum | MatchedScalarFieldEnum[]
  }

  /**
   * Matched findFirstOrThrow
   */
  export type MatchedFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Matched
     */
    select?: MatchedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Matched
     */
    omit?: MatchedOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchedInclude<ExtArgs> | null
    /**
     * Filter, which Matched to fetch.
     */
    where?: MatchedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matcheds to fetch.
     */
    orderBy?: MatchedOrderByWithRelationInput | MatchedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matcheds.
     */
    cursor?: MatchedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matcheds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matcheds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matcheds.
     */
    distinct?: MatchedScalarFieldEnum | MatchedScalarFieldEnum[]
  }

  /**
   * Matched findMany
   */
  export type MatchedFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Matched
     */
    select?: MatchedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Matched
     */
    omit?: MatchedOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchedInclude<ExtArgs> | null
    /**
     * Filter, which Matcheds to fetch.
     */
    where?: MatchedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matcheds to fetch.
     */
    orderBy?: MatchedOrderByWithRelationInput | MatchedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Matcheds.
     */
    cursor?: MatchedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matcheds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matcheds.
     */
    skip?: number
    distinct?: MatchedScalarFieldEnum | MatchedScalarFieldEnum[]
  }

  /**
   * Matched create
   */
  export type MatchedCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Matched
     */
    select?: MatchedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Matched
     */
    omit?: MatchedOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchedInclude<ExtArgs> | null
    /**
     * The data needed to create a Matched.
     */
    data: XOR<MatchedCreateInput, MatchedUncheckedCreateInput>
  }

  /**
   * Matched createMany
   */
  export type MatchedCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Matcheds.
     */
    data: MatchedCreateManyInput | MatchedCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Matched createManyAndReturn
   */
  export type MatchedCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Matched
     */
    select?: MatchedSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Matched
     */
    omit?: MatchedOmit<ExtArgs> | null
    /**
     * The data used to create many Matcheds.
     */
    data: MatchedCreateManyInput | MatchedCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchedIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Matched update
   */
  export type MatchedUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Matched
     */
    select?: MatchedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Matched
     */
    omit?: MatchedOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchedInclude<ExtArgs> | null
    /**
     * The data needed to update a Matched.
     */
    data: XOR<MatchedUpdateInput, MatchedUncheckedUpdateInput>
    /**
     * Choose, which Matched to update.
     */
    where: MatchedWhereUniqueInput
  }

  /**
   * Matched updateMany
   */
  export type MatchedUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Matcheds.
     */
    data: XOR<MatchedUpdateManyMutationInput, MatchedUncheckedUpdateManyInput>
    /**
     * Filter which Matcheds to update
     */
    where?: MatchedWhereInput
    /**
     * Limit how many Matcheds to update.
     */
    limit?: number
  }

  /**
   * Matched updateManyAndReturn
   */
  export type MatchedUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Matched
     */
    select?: MatchedSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Matched
     */
    omit?: MatchedOmit<ExtArgs> | null
    /**
     * The data used to update Matcheds.
     */
    data: XOR<MatchedUpdateManyMutationInput, MatchedUncheckedUpdateManyInput>
    /**
     * Filter which Matcheds to update
     */
    where?: MatchedWhereInput
    /**
     * Limit how many Matcheds to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchedIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Matched upsert
   */
  export type MatchedUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Matched
     */
    select?: MatchedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Matched
     */
    omit?: MatchedOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchedInclude<ExtArgs> | null
    /**
     * The filter to search for the Matched to update in case it exists.
     */
    where: MatchedWhereUniqueInput
    /**
     * In case the Matched found by the `where` argument doesn't exist, create a new Matched with this data.
     */
    create: XOR<MatchedCreateInput, MatchedUncheckedCreateInput>
    /**
     * In case the Matched was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchedUpdateInput, MatchedUncheckedUpdateInput>
  }

  /**
   * Matched delete
   */
  export type MatchedDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Matched
     */
    select?: MatchedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Matched
     */
    omit?: MatchedOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchedInclude<ExtArgs> | null
    /**
     * Filter which Matched to delete.
     */
    where: MatchedWhereUniqueInput
  }

  /**
   * Matched deleteMany
   */
  export type MatchedDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Matcheds to delete
     */
    where?: MatchedWhereInput
    /**
     * Limit how many Matcheds to delete.
     */
    limit?: number
  }

  /**
   * Matched without action
   */
  export type MatchedDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Matched
     */
    select?: MatchedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Matched
     */
    omit?: MatchedOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchedInclude<ExtArgs> | null
  }


  /**
   * Model GoogleAuth
   */

  export type AggregateGoogleAuth = {
    _count: GoogleAuthCountAggregateOutputType | null
    _min: GoogleAuthMinAggregateOutputType | null
    _max: GoogleAuthMaxAggregateOutputType | null
  }

  export type GoogleAuthMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    accessToken: string | null
    refreshToken: string | null
    expiryDate: Date | null
    scope: string | null
    tokenType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GoogleAuthMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    accessToken: string | null
    refreshToken: string | null
    expiryDate: Date | null
    scope: string | null
    tokenType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GoogleAuthCountAggregateOutputType = {
    id: number
    email: number
    name: number
    accessToken: number
    refreshToken: number
    expiryDate: number
    scope: number
    tokenType: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GoogleAuthMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    accessToken?: true
    refreshToken?: true
    expiryDate?: true
    scope?: true
    tokenType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GoogleAuthMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    accessToken?: true
    refreshToken?: true
    expiryDate?: true
    scope?: true
    tokenType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GoogleAuthCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    accessToken?: true
    refreshToken?: true
    expiryDate?: true
    scope?: true
    tokenType?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GoogleAuthAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GoogleAuth to aggregate.
     */
    where?: GoogleAuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoogleAuths to fetch.
     */
    orderBy?: GoogleAuthOrderByWithRelationInput | GoogleAuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GoogleAuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoogleAuths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoogleAuths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GoogleAuths
    **/
    _count?: true | GoogleAuthCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GoogleAuthMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GoogleAuthMaxAggregateInputType
  }

  export type GetGoogleAuthAggregateType<T extends GoogleAuthAggregateArgs> = {
        [P in keyof T & keyof AggregateGoogleAuth]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGoogleAuth[P]>
      : GetScalarType<T[P], AggregateGoogleAuth[P]>
  }




  export type GoogleAuthGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GoogleAuthWhereInput
    orderBy?: GoogleAuthOrderByWithAggregationInput | GoogleAuthOrderByWithAggregationInput[]
    by: GoogleAuthScalarFieldEnum[] | GoogleAuthScalarFieldEnum
    having?: GoogleAuthScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GoogleAuthCountAggregateInputType | true
    _min?: GoogleAuthMinAggregateInputType
    _max?: GoogleAuthMaxAggregateInputType
  }

  export type GoogleAuthGroupByOutputType = {
    id: string
    email: string
    name: string
    accessToken: string
    refreshToken: string | null
    expiryDate: Date | null
    scope: string
    tokenType: string
    createdAt: Date
    updatedAt: Date
    _count: GoogleAuthCountAggregateOutputType | null
    _min: GoogleAuthMinAggregateOutputType | null
    _max: GoogleAuthMaxAggregateOutputType | null
  }

  type GetGoogleAuthGroupByPayload<T extends GoogleAuthGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GoogleAuthGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GoogleAuthGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GoogleAuthGroupByOutputType[P]>
            : GetScalarType<T[P], GoogleAuthGroupByOutputType[P]>
        }
      >
    >


  export type GoogleAuthSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiryDate?: boolean
    scope?: boolean
    tokenType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["googleAuth"]>

  export type GoogleAuthSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiryDate?: boolean
    scope?: boolean
    tokenType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["googleAuth"]>

  export type GoogleAuthSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiryDate?: boolean
    scope?: boolean
    tokenType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["googleAuth"]>

  export type GoogleAuthSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiryDate?: boolean
    scope?: boolean
    tokenType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GoogleAuthOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "accessToken" | "refreshToken" | "expiryDate" | "scope" | "tokenType" | "createdAt" | "updatedAt", ExtArgs["result"]["googleAuth"]>

  export type $GoogleAuthPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GoogleAuth"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string
      accessToken: string
      refreshToken: string | null
      expiryDate: Date | null
      scope: string
      tokenType: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["googleAuth"]>
    composites: {}
  }

  type GoogleAuthGetPayload<S extends boolean | null | undefined | GoogleAuthDefaultArgs> = $Result.GetResult<Prisma.$GoogleAuthPayload, S>

  type GoogleAuthCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GoogleAuthFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GoogleAuthCountAggregateInputType | true
    }

  export interface GoogleAuthDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GoogleAuth'], meta: { name: 'GoogleAuth' } }
    /**
     * Find zero or one GoogleAuth that matches the filter.
     * @param {GoogleAuthFindUniqueArgs} args - Arguments to find a GoogleAuth
     * @example
     * // Get one GoogleAuth
     * const googleAuth = await prisma.googleAuth.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GoogleAuthFindUniqueArgs>(args: SelectSubset<T, GoogleAuthFindUniqueArgs<ExtArgs>>): Prisma__GoogleAuthClient<$Result.GetResult<Prisma.$GoogleAuthPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GoogleAuth that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GoogleAuthFindUniqueOrThrowArgs} args - Arguments to find a GoogleAuth
     * @example
     * // Get one GoogleAuth
     * const googleAuth = await prisma.googleAuth.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GoogleAuthFindUniqueOrThrowArgs>(args: SelectSubset<T, GoogleAuthFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GoogleAuthClient<$Result.GetResult<Prisma.$GoogleAuthPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GoogleAuth that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoogleAuthFindFirstArgs} args - Arguments to find a GoogleAuth
     * @example
     * // Get one GoogleAuth
     * const googleAuth = await prisma.googleAuth.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GoogleAuthFindFirstArgs>(args?: SelectSubset<T, GoogleAuthFindFirstArgs<ExtArgs>>): Prisma__GoogleAuthClient<$Result.GetResult<Prisma.$GoogleAuthPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GoogleAuth that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoogleAuthFindFirstOrThrowArgs} args - Arguments to find a GoogleAuth
     * @example
     * // Get one GoogleAuth
     * const googleAuth = await prisma.googleAuth.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GoogleAuthFindFirstOrThrowArgs>(args?: SelectSubset<T, GoogleAuthFindFirstOrThrowArgs<ExtArgs>>): Prisma__GoogleAuthClient<$Result.GetResult<Prisma.$GoogleAuthPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GoogleAuths that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoogleAuthFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GoogleAuths
     * const googleAuths = await prisma.googleAuth.findMany()
     * 
     * // Get first 10 GoogleAuths
     * const googleAuths = await prisma.googleAuth.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const googleAuthWithIdOnly = await prisma.googleAuth.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GoogleAuthFindManyArgs>(args?: SelectSubset<T, GoogleAuthFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoogleAuthPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GoogleAuth.
     * @param {GoogleAuthCreateArgs} args - Arguments to create a GoogleAuth.
     * @example
     * // Create one GoogleAuth
     * const GoogleAuth = await prisma.googleAuth.create({
     *   data: {
     *     // ... data to create a GoogleAuth
     *   }
     * })
     * 
     */
    create<T extends GoogleAuthCreateArgs>(args: SelectSubset<T, GoogleAuthCreateArgs<ExtArgs>>): Prisma__GoogleAuthClient<$Result.GetResult<Prisma.$GoogleAuthPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GoogleAuths.
     * @param {GoogleAuthCreateManyArgs} args - Arguments to create many GoogleAuths.
     * @example
     * // Create many GoogleAuths
     * const googleAuth = await prisma.googleAuth.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GoogleAuthCreateManyArgs>(args?: SelectSubset<T, GoogleAuthCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GoogleAuths and returns the data saved in the database.
     * @param {GoogleAuthCreateManyAndReturnArgs} args - Arguments to create many GoogleAuths.
     * @example
     * // Create many GoogleAuths
     * const googleAuth = await prisma.googleAuth.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GoogleAuths and only return the `id`
     * const googleAuthWithIdOnly = await prisma.googleAuth.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GoogleAuthCreateManyAndReturnArgs>(args?: SelectSubset<T, GoogleAuthCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoogleAuthPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GoogleAuth.
     * @param {GoogleAuthDeleteArgs} args - Arguments to delete one GoogleAuth.
     * @example
     * // Delete one GoogleAuth
     * const GoogleAuth = await prisma.googleAuth.delete({
     *   where: {
     *     // ... filter to delete one GoogleAuth
     *   }
     * })
     * 
     */
    delete<T extends GoogleAuthDeleteArgs>(args: SelectSubset<T, GoogleAuthDeleteArgs<ExtArgs>>): Prisma__GoogleAuthClient<$Result.GetResult<Prisma.$GoogleAuthPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GoogleAuth.
     * @param {GoogleAuthUpdateArgs} args - Arguments to update one GoogleAuth.
     * @example
     * // Update one GoogleAuth
     * const googleAuth = await prisma.googleAuth.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GoogleAuthUpdateArgs>(args: SelectSubset<T, GoogleAuthUpdateArgs<ExtArgs>>): Prisma__GoogleAuthClient<$Result.GetResult<Prisma.$GoogleAuthPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GoogleAuths.
     * @param {GoogleAuthDeleteManyArgs} args - Arguments to filter GoogleAuths to delete.
     * @example
     * // Delete a few GoogleAuths
     * const { count } = await prisma.googleAuth.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GoogleAuthDeleteManyArgs>(args?: SelectSubset<T, GoogleAuthDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GoogleAuths.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoogleAuthUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GoogleAuths
     * const googleAuth = await prisma.googleAuth.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GoogleAuthUpdateManyArgs>(args: SelectSubset<T, GoogleAuthUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GoogleAuths and returns the data updated in the database.
     * @param {GoogleAuthUpdateManyAndReturnArgs} args - Arguments to update many GoogleAuths.
     * @example
     * // Update many GoogleAuths
     * const googleAuth = await prisma.googleAuth.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GoogleAuths and only return the `id`
     * const googleAuthWithIdOnly = await prisma.googleAuth.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GoogleAuthUpdateManyAndReturnArgs>(args: SelectSubset<T, GoogleAuthUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoogleAuthPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GoogleAuth.
     * @param {GoogleAuthUpsertArgs} args - Arguments to update or create a GoogleAuth.
     * @example
     * // Update or create a GoogleAuth
     * const googleAuth = await prisma.googleAuth.upsert({
     *   create: {
     *     // ... data to create a GoogleAuth
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GoogleAuth we want to update
     *   }
     * })
     */
    upsert<T extends GoogleAuthUpsertArgs>(args: SelectSubset<T, GoogleAuthUpsertArgs<ExtArgs>>): Prisma__GoogleAuthClient<$Result.GetResult<Prisma.$GoogleAuthPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GoogleAuths.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoogleAuthCountArgs} args - Arguments to filter GoogleAuths to count.
     * @example
     * // Count the number of GoogleAuths
     * const count = await prisma.googleAuth.count({
     *   where: {
     *     // ... the filter for the GoogleAuths we want to count
     *   }
     * })
    **/
    count<T extends GoogleAuthCountArgs>(
      args?: Subset<T, GoogleAuthCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GoogleAuthCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GoogleAuth.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoogleAuthAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GoogleAuthAggregateArgs>(args: Subset<T, GoogleAuthAggregateArgs>): Prisma.PrismaPromise<GetGoogleAuthAggregateType<T>>

    /**
     * Group by GoogleAuth.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoogleAuthGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GoogleAuthGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GoogleAuthGroupByArgs['orderBy'] }
        : { orderBy?: GoogleAuthGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GoogleAuthGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGoogleAuthGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GoogleAuth model
   */
  readonly fields: GoogleAuthFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GoogleAuth.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GoogleAuthClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GoogleAuth model
   */
  interface GoogleAuthFieldRefs {
    readonly id: FieldRef<"GoogleAuth", 'String'>
    readonly email: FieldRef<"GoogleAuth", 'String'>
    readonly name: FieldRef<"GoogleAuth", 'String'>
    readonly accessToken: FieldRef<"GoogleAuth", 'String'>
    readonly refreshToken: FieldRef<"GoogleAuth", 'String'>
    readonly expiryDate: FieldRef<"GoogleAuth", 'DateTime'>
    readonly scope: FieldRef<"GoogleAuth", 'String'>
    readonly tokenType: FieldRef<"GoogleAuth", 'String'>
    readonly createdAt: FieldRef<"GoogleAuth", 'DateTime'>
    readonly updatedAt: FieldRef<"GoogleAuth", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GoogleAuth findUnique
   */
  export type GoogleAuthFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoogleAuth
     */
    select?: GoogleAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GoogleAuth
     */
    omit?: GoogleAuthOmit<ExtArgs> | null
    /**
     * Filter, which GoogleAuth to fetch.
     */
    where: GoogleAuthWhereUniqueInput
  }

  /**
   * GoogleAuth findUniqueOrThrow
   */
  export type GoogleAuthFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoogleAuth
     */
    select?: GoogleAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GoogleAuth
     */
    omit?: GoogleAuthOmit<ExtArgs> | null
    /**
     * Filter, which GoogleAuth to fetch.
     */
    where: GoogleAuthWhereUniqueInput
  }

  /**
   * GoogleAuth findFirst
   */
  export type GoogleAuthFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoogleAuth
     */
    select?: GoogleAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GoogleAuth
     */
    omit?: GoogleAuthOmit<ExtArgs> | null
    /**
     * Filter, which GoogleAuth to fetch.
     */
    where?: GoogleAuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoogleAuths to fetch.
     */
    orderBy?: GoogleAuthOrderByWithRelationInput | GoogleAuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GoogleAuths.
     */
    cursor?: GoogleAuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoogleAuths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoogleAuths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GoogleAuths.
     */
    distinct?: GoogleAuthScalarFieldEnum | GoogleAuthScalarFieldEnum[]
  }

  /**
   * GoogleAuth findFirstOrThrow
   */
  export type GoogleAuthFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoogleAuth
     */
    select?: GoogleAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GoogleAuth
     */
    omit?: GoogleAuthOmit<ExtArgs> | null
    /**
     * Filter, which GoogleAuth to fetch.
     */
    where?: GoogleAuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoogleAuths to fetch.
     */
    orderBy?: GoogleAuthOrderByWithRelationInput | GoogleAuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GoogleAuths.
     */
    cursor?: GoogleAuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoogleAuths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoogleAuths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GoogleAuths.
     */
    distinct?: GoogleAuthScalarFieldEnum | GoogleAuthScalarFieldEnum[]
  }

  /**
   * GoogleAuth findMany
   */
  export type GoogleAuthFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoogleAuth
     */
    select?: GoogleAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GoogleAuth
     */
    omit?: GoogleAuthOmit<ExtArgs> | null
    /**
     * Filter, which GoogleAuths to fetch.
     */
    where?: GoogleAuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoogleAuths to fetch.
     */
    orderBy?: GoogleAuthOrderByWithRelationInput | GoogleAuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GoogleAuths.
     */
    cursor?: GoogleAuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoogleAuths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoogleAuths.
     */
    skip?: number
    distinct?: GoogleAuthScalarFieldEnum | GoogleAuthScalarFieldEnum[]
  }

  /**
   * GoogleAuth create
   */
  export type GoogleAuthCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoogleAuth
     */
    select?: GoogleAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GoogleAuth
     */
    omit?: GoogleAuthOmit<ExtArgs> | null
    /**
     * The data needed to create a GoogleAuth.
     */
    data: XOR<GoogleAuthCreateInput, GoogleAuthUncheckedCreateInput>
  }

  /**
   * GoogleAuth createMany
   */
  export type GoogleAuthCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GoogleAuths.
     */
    data: GoogleAuthCreateManyInput | GoogleAuthCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GoogleAuth createManyAndReturn
   */
  export type GoogleAuthCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoogleAuth
     */
    select?: GoogleAuthSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GoogleAuth
     */
    omit?: GoogleAuthOmit<ExtArgs> | null
    /**
     * The data used to create many GoogleAuths.
     */
    data: GoogleAuthCreateManyInput | GoogleAuthCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GoogleAuth update
   */
  export type GoogleAuthUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoogleAuth
     */
    select?: GoogleAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GoogleAuth
     */
    omit?: GoogleAuthOmit<ExtArgs> | null
    /**
     * The data needed to update a GoogleAuth.
     */
    data: XOR<GoogleAuthUpdateInput, GoogleAuthUncheckedUpdateInput>
    /**
     * Choose, which GoogleAuth to update.
     */
    where: GoogleAuthWhereUniqueInput
  }

  /**
   * GoogleAuth updateMany
   */
  export type GoogleAuthUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GoogleAuths.
     */
    data: XOR<GoogleAuthUpdateManyMutationInput, GoogleAuthUncheckedUpdateManyInput>
    /**
     * Filter which GoogleAuths to update
     */
    where?: GoogleAuthWhereInput
    /**
     * Limit how many GoogleAuths to update.
     */
    limit?: number
  }

  /**
   * GoogleAuth updateManyAndReturn
   */
  export type GoogleAuthUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoogleAuth
     */
    select?: GoogleAuthSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GoogleAuth
     */
    omit?: GoogleAuthOmit<ExtArgs> | null
    /**
     * The data used to update GoogleAuths.
     */
    data: XOR<GoogleAuthUpdateManyMutationInput, GoogleAuthUncheckedUpdateManyInput>
    /**
     * Filter which GoogleAuths to update
     */
    where?: GoogleAuthWhereInput
    /**
     * Limit how many GoogleAuths to update.
     */
    limit?: number
  }

  /**
   * GoogleAuth upsert
   */
  export type GoogleAuthUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoogleAuth
     */
    select?: GoogleAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GoogleAuth
     */
    omit?: GoogleAuthOmit<ExtArgs> | null
    /**
     * The filter to search for the GoogleAuth to update in case it exists.
     */
    where: GoogleAuthWhereUniqueInput
    /**
     * In case the GoogleAuth found by the `where` argument doesn't exist, create a new GoogleAuth with this data.
     */
    create: XOR<GoogleAuthCreateInput, GoogleAuthUncheckedCreateInput>
    /**
     * In case the GoogleAuth was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GoogleAuthUpdateInput, GoogleAuthUncheckedUpdateInput>
  }

  /**
   * GoogleAuth delete
   */
  export type GoogleAuthDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoogleAuth
     */
    select?: GoogleAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GoogleAuth
     */
    omit?: GoogleAuthOmit<ExtArgs> | null
    /**
     * Filter which GoogleAuth to delete.
     */
    where: GoogleAuthWhereUniqueInput
  }

  /**
   * GoogleAuth deleteMany
   */
  export type GoogleAuthDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GoogleAuths to delete
     */
    where?: GoogleAuthWhereInput
    /**
     * Limit how many GoogleAuths to delete.
     */
    limit?: number
  }

  /**
   * GoogleAuth without action
   */
  export type GoogleAuthDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoogleAuth
     */
    select?: GoogleAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GoogleAuth
     */
    omit?: GoogleAuthOmit<ExtArgs> | null
  }


  /**
   * Model ProcessedEmail
   */

  export type AggregateProcessedEmail = {
    _count: ProcessedEmailCountAggregateOutputType | null
    _avg: ProcessedEmailAvgAggregateOutputType | null
    _sum: ProcessedEmailSumAggregateOutputType | null
    _min: ProcessedEmailMinAggregateOutputType | null
    _max: ProcessedEmailMaxAggregateOutputType | null
  }

  export type ProcessedEmailAvgAggregateOutputType = {
    attachmentCount: number | null
  }

  export type ProcessedEmailSumAggregateOutputType = {
    attachmentCount: number | null
  }

  export type ProcessedEmailMinAggregateOutputType = {
    id: string | null
    gmailId: string | null
    userEmail: string | null
    subject: string | null
    from: string | null
    attachmentCount: number | null
    processedAt: Date | null
  }

  export type ProcessedEmailMaxAggregateOutputType = {
    id: string | null
    gmailId: string | null
    userEmail: string | null
    subject: string | null
    from: string | null
    attachmentCount: number | null
    processedAt: Date | null
  }

  export type ProcessedEmailCountAggregateOutputType = {
    id: number
    gmailId: number
    userEmail: number
    subject: number
    from: number
    attachmentCount: number
    processedAt: number
    _all: number
  }


  export type ProcessedEmailAvgAggregateInputType = {
    attachmentCount?: true
  }

  export type ProcessedEmailSumAggregateInputType = {
    attachmentCount?: true
  }

  export type ProcessedEmailMinAggregateInputType = {
    id?: true
    gmailId?: true
    userEmail?: true
    subject?: true
    from?: true
    attachmentCount?: true
    processedAt?: true
  }

  export type ProcessedEmailMaxAggregateInputType = {
    id?: true
    gmailId?: true
    userEmail?: true
    subject?: true
    from?: true
    attachmentCount?: true
    processedAt?: true
  }

  export type ProcessedEmailCountAggregateInputType = {
    id?: true
    gmailId?: true
    userEmail?: true
    subject?: true
    from?: true
    attachmentCount?: true
    processedAt?: true
    _all?: true
  }

  export type ProcessedEmailAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProcessedEmail to aggregate.
     */
    where?: ProcessedEmailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessedEmails to fetch.
     */
    orderBy?: ProcessedEmailOrderByWithRelationInput | ProcessedEmailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProcessedEmailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessedEmails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessedEmails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProcessedEmails
    **/
    _count?: true | ProcessedEmailCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProcessedEmailAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProcessedEmailSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProcessedEmailMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProcessedEmailMaxAggregateInputType
  }

  export type GetProcessedEmailAggregateType<T extends ProcessedEmailAggregateArgs> = {
        [P in keyof T & keyof AggregateProcessedEmail]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProcessedEmail[P]>
      : GetScalarType<T[P], AggregateProcessedEmail[P]>
  }




  export type ProcessedEmailGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProcessedEmailWhereInput
    orderBy?: ProcessedEmailOrderByWithAggregationInput | ProcessedEmailOrderByWithAggregationInput[]
    by: ProcessedEmailScalarFieldEnum[] | ProcessedEmailScalarFieldEnum
    having?: ProcessedEmailScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProcessedEmailCountAggregateInputType | true
    _avg?: ProcessedEmailAvgAggregateInputType
    _sum?: ProcessedEmailSumAggregateInputType
    _min?: ProcessedEmailMinAggregateInputType
    _max?: ProcessedEmailMaxAggregateInputType
  }

  export type ProcessedEmailGroupByOutputType = {
    id: string
    gmailId: string
    userEmail: string
    subject: string
    from: string
    attachmentCount: number
    processedAt: Date
    _count: ProcessedEmailCountAggregateOutputType | null
    _avg: ProcessedEmailAvgAggregateOutputType | null
    _sum: ProcessedEmailSumAggregateOutputType | null
    _min: ProcessedEmailMinAggregateOutputType | null
    _max: ProcessedEmailMaxAggregateOutputType | null
  }

  type GetProcessedEmailGroupByPayload<T extends ProcessedEmailGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProcessedEmailGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProcessedEmailGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProcessedEmailGroupByOutputType[P]>
            : GetScalarType<T[P], ProcessedEmailGroupByOutputType[P]>
        }
      >
    >


  export type ProcessedEmailSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gmailId?: boolean
    userEmail?: boolean
    subject?: boolean
    from?: boolean
    attachmentCount?: boolean
    processedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["processedEmail"]>

  export type ProcessedEmailSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gmailId?: boolean
    userEmail?: boolean
    subject?: boolean
    from?: boolean
    attachmentCount?: boolean
    processedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["processedEmail"]>

  export type ProcessedEmailSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gmailId?: boolean
    userEmail?: boolean
    subject?: boolean
    from?: boolean
    attachmentCount?: boolean
    processedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["processedEmail"]>

  export type ProcessedEmailSelectScalar = {
    id?: boolean
    gmailId?: boolean
    userEmail?: boolean
    subject?: boolean
    from?: boolean
    attachmentCount?: boolean
    processedAt?: boolean
  }

  export type ProcessedEmailOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "gmailId" | "userEmail" | "subject" | "from" | "attachmentCount" | "processedAt", ExtArgs["result"]["processedEmail"]>
  export type ProcessedEmailInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProcessedEmailIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProcessedEmailIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProcessedEmailPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProcessedEmail"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      gmailId: string
      userEmail: string
      subject: string
      from: string
      attachmentCount: number
      processedAt: Date
    }, ExtArgs["result"]["processedEmail"]>
    composites: {}
  }

  type ProcessedEmailGetPayload<S extends boolean | null | undefined | ProcessedEmailDefaultArgs> = $Result.GetResult<Prisma.$ProcessedEmailPayload, S>

  type ProcessedEmailCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProcessedEmailFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProcessedEmailCountAggregateInputType | true
    }

  export interface ProcessedEmailDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProcessedEmail'], meta: { name: 'ProcessedEmail' } }
    /**
     * Find zero or one ProcessedEmail that matches the filter.
     * @param {ProcessedEmailFindUniqueArgs} args - Arguments to find a ProcessedEmail
     * @example
     * // Get one ProcessedEmail
     * const processedEmail = await prisma.processedEmail.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProcessedEmailFindUniqueArgs>(args: SelectSubset<T, ProcessedEmailFindUniqueArgs<ExtArgs>>): Prisma__ProcessedEmailClient<$Result.GetResult<Prisma.$ProcessedEmailPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProcessedEmail that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProcessedEmailFindUniqueOrThrowArgs} args - Arguments to find a ProcessedEmail
     * @example
     * // Get one ProcessedEmail
     * const processedEmail = await prisma.processedEmail.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProcessedEmailFindUniqueOrThrowArgs>(args: SelectSubset<T, ProcessedEmailFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProcessedEmailClient<$Result.GetResult<Prisma.$ProcessedEmailPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProcessedEmail that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEmailFindFirstArgs} args - Arguments to find a ProcessedEmail
     * @example
     * // Get one ProcessedEmail
     * const processedEmail = await prisma.processedEmail.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProcessedEmailFindFirstArgs>(args?: SelectSubset<T, ProcessedEmailFindFirstArgs<ExtArgs>>): Prisma__ProcessedEmailClient<$Result.GetResult<Prisma.$ProcessedEmailPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProcessedEmail that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEmailFindFirstOrThrowArgs} args - Arguments to find a ProcessedEmail
     * @example
     * // Get one ProcessedEmail
     * const processedEmail = await prisma.processedEmail.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProcessedEmailFindFirstOrThrowArgs>(args?: SelectSubset<T, ProcessedEmailFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProcessedEmailClient<$Result.GetResult<Prisma.$ProcessedEmailPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProcessedEmails that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEmailFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProcessedEmails
     * const processedEmails = await prisma.processedEmail.findMany()
     * 
     * // Get first 10 ProcessedEmails
     * const processedEmails = await prisma.processedEmail.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const processedEmailWithIdOnly = await prisma.processedEmail.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProcessedEmailFindManyArgs>(args?: SelectSubset<T, ProcessedEmailFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessedEmailPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProcessedEmail.
     * @param {ProcessedEmailCreateArgs} args - Arguments to create a ProcessedEmail.
     * @example
     * // Create one ProcessedEmail
     * const ProcessedEmail = await prisma.processedEmail.create({
     *   data: {
     *     // ... data to create a ProcessedEmail
     *   }
     * })
     * 
     */
    create<T extends ProcessedEmailCreateArgs>(args: SelectSubset<T, ProcessedEmailCreateArgs<ExtArgs>>): Prisma__ProcessedEmailClient<$Result.GetResult<Prisma.$ProcessedEmailPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProcessedEmails.
     * @param {ProcessedEmailCreateManyArgs} args - Arguments to create many ProcessedEmails.
     * @example
     * // Create many ProcessedEmails
     * const processedEmail = await prisma.processedEmail.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProcessedEmailCreateManyArgs>(args?: SelectSubset<T, ProcessedEmailCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProcessedEmails and returns the data saved in the database.
     * @param {ProcessedEmailCreateManyAndReturnArgs} args - Arguments to create many ProcessedEmails.
     * @example
     * // Create many ProcessedEmails
     * const processedEmail = await prisma.processedEmail.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProcessedEmails and only return the `id`
     * const processedEmailWithIdOnly = await prisma.processedEmail.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProcessedEmailCreateManyAndReturnArgs>(args?: SelectSubset<T, ProcessedEmailCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessedEmailPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProcessedEmail.
     * @param {ProcessedEmailDeleteArgs} args - Arguments to delete one ProcessedEmail.
     * @example
     * // Delete one ProcessedEmail
     * const ProcessedEmail = await prisma.processedEmail.delete({
     *   where: {
     *     // ... filter to delete one ProcessedEmail
     *   }
     * })
     * 
     */
    delete<T extends ProcessedEmailDeleteArgs>(args: SelectSubset<T, ProcessedEmailDeleteArgs<ExtArgs>>): Prisma__ProcessedEmailClient<$Result.GetResult<Prisma.$ProcessedEmailPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProcessedEmail.
     * @param {ProcessedEmailUpdateArgs} args - Arguments to update one ProcessedEmail.
     * @example
     * // Update one ProcessedEmail
     * const processedEmail = await prisma.processedEmail.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProcessedEmailUpdateArgs>(args: SelectSubset<T, ProcessedEmailUpdateArgs<ExtArgs>>): Prisma__ProcessedEmailClient<$Result.GetResult<Prisma.$ProcessedEmailPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProcessedEmails.
     * @param {ProcessedEmailDeleteManyArgs} args - Arguments to filter ProcessedEmails to delete.
     * @example
     * // Delete a few ProcessedEmails
     * const { count } = await prisma.processedEmail.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProcessedEmailDeleteManyArgs>(args?: SelectSubset<T, ProcessedEmailDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProcessedEmails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEmailUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProcessedEmails
     * const processedEmail = await prisma.processedEmail.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProcessedEmailUpdateManyArgs>(args: SelectSubset<T, ProcessedEmailUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProcessedEmails and returns the data updated in the database.
     * @param {ProcessedEmailUpdateManyAndReturnArgs} args - Arguments to update many ProcessedEmails.
     * @example
     * // Update many ProcessedEmails
     * const processedEmail = await prisma.processedEmail.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProcessedEmails and only return the `id`
     * const processedEmailWithIdOnly = await prisma.processedEmail.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProcessedEmailUpdateManyAndReturnArgs>(args: SelectSubset<T, ProcessedEmailUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessedEmailPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProcessedEmail.
     * @param {ProcessedEmailUpsertArgs} args - Arguments to update or create a ProcessedEmail.
     * @example
     * // Update or create a ProcessedEmail
     * const processedEmail = await prisma.processedEmail.upsert({
     *   create: {
     *     // ... data to create a ProcessedEmail
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProcessedEmail we want to update
     *   }
     * })
     */
    upsert<T extends ProcessedEmailUpsertArgs>(args: SelectSubset<T, ProcessedEmailUpsertArgs<ExtArgs>>): Prisma__ProcessedEmailClient<$Result.GetResult<Prisma.$ProcessedEmailPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProcessedEmails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEmailCountArgs} args - Arguments to filter ProcessedEmails to count.
     * @example
     * // Count the number of ProcessedEmails
     * const count = await prisma.processedEmail.count({
     *   where: {
     *     // ... the filter for the ProcessedEmails we want to count
     *   }
     * })
    **/
    count<T extends ProcessedEmailCountArgs>(
      args?: Subset<T, ProcessedEmailCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProcessedEmailCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProcessedEmail.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEmailAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProcessedEmailAggregateArgs>(args: Subset<T, ProcessedEmailAggregateArgs>): Prisma.PrismaPromise<GetProcessedEmailAggregateType<T>>

    /**
     * Group by ProcessedEmail.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEmailGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProcessedEmailGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProcessedEmailGroupByArgs['orderBy'] }
        : { orderBy?: ProcessedEmailGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProcessedEmailGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProcessedEmailGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProcessedEmail model
   */
  readonly fields: ProcessedEmailFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProcessedEmail.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProcessedEmailClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProcessedEmail model
   */
  interface ProcessedEmailFieldRefs {
    readonly id: FieldRef<"ProcessedEmail", 'String'>
    readonly gmailId: FieldRef<"ProcessedEmail", 'String'>
    readonly userEmail: FieldRef<"ProcessedEmail", 'String'>
    readonly subject: FieldRef<"ProcessedEmail", 'String'>
    readonly from: FieldRef<"ProcessedEmail", 'String'>
    readonly attachmentCount: FieldRef<"ProcessedEmail", 'Int'>
    readonly processedAt: FieldRef<"ProcessedEmail", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProcessedEmail findUnique
   */
  export type ProcessedEmailFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEmail
     */
    select?: ProcessedEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEmail
     */
    omit?: ProcessedEmailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedEmailInclude<ExtArgs> | null
    /**
     * Filter, which ProcessedEmail to fetch.
     */
    where: ProcessedEmailWhereUniqueInput
  }

  /**
   * ProcessedEmail findUniqueOrThrow
   */
  export type ProcessedEmailFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEmail
     */
    select?: ProcessedEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEmail
     */
    omit?: ProcessedEmailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedEmailInclude<ExtArgs> | null
    /**
     * Filter, which ProcessedEmail to fetch.
     */
    where: ProcessedEmailWhereUniqueInput
  }

  /**
   * ProcessedEmail findFirst
   */
  export type ProcessedEmailFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEmail
     */
    select?: ProcessedEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEmail
     */
    omit?: ProcessedEmailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedEmailInclude<ExtArgs> | null
    /**
     * Filter, which ProcessedEmail to fetch.
     */
    where?: ProcessedEmailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessedEmails to fetch.
     */
    orderBy?: ProcessedEmailOrderByWithRelationInput | ProcessedEmailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProcessedEmails.
     */
    cursor?: ProcessedEmailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessedEmails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessedEmails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProcessedEmails.
     */
    distinct?: ProcessedEmailScalarFieldEnum | ProcessedEmailScalarFieldEnum[]
  }

  /**
   * ProcessedEmail findFirstOrThrow
   */
  export type ProcessedEmailFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEmail
     */
    select?: ProcessedEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEmail
     */
    omit?: ProcessedEmailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedEmailInclude<ExtArgs> | null
    /**
     * Filter, which ProcessedEmail to fetch.
     */
    where?: ProcessedEmailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessedEmails to fetch.
     */
    orderBy?: ProcessedEmailOrderByWithRelationInput | ProcessedEmailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProcessedEmails.
     */
    cursor?: ProcessedEmailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessedEmails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessedEmails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProcessedEmails.
     */
    distinct?: ProcessedEmailScalarFieldEnum | ProcessedEmailScalarFieldEnum[]
  }

  /**
   * ProcessedEmail findMany
   */
  export type ProcessedEmailFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEmail
     */
    select?: ProcessedEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEmail
     */
    omit?: ProcessedEmailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedEmailInclude<ExtArgs> | null
    /**
     * Filter, which ProcessedEmails to fetch.
     */
    where?: ProcessedEmailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessedEmails to fetch.
     */
    orderBy?: ProcessedEmailOrderByWithRelationInput | ProcessedEmailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProcessedEmails.
     */
    cursor?: ProcessedEmailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessedEmails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessedEmails.
     */
    skip?: number
    distinct?: ProcessedEmailScalarFieldEnum | ProcessedEmailScalarFieldEnum[]
  }

  /**
   * ProcessedEmail create
   */
  export type ProcessedEmailCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEmail
     */
    select?: ProcessedEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEmail
     */
    omit?: ProcessedEmailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedEmailInclude<ExtArgs> | null
    /**
     * The data needed to create a ProcessedEmail.
     */
    data: XOR<ProcessedEmailCreateInput, ProcessedEmailUncheckedCreateInput>
  }

  /**
   * ProcessedEmail createMany
   */
  export type ProcessedEmailCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProcessedEmails.
     */
    data: ProcessedEmailCreateManyInput | ProcessedEmailCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProcessedEmail createManyAndReturn
   */
  export type ProcessedEmailCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEmail
     */
    select?: ProcessedEmailSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEmail
     */
    omit?: ProcessedEmailOmit<ExtArgs> | null
    /**
     * The data used to create many ProcessedEmails.
     */
    data: ProcessedEmailCreateManyInput | ProcessedEmailCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedEmailIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProcessedEmail update
   */
  export type ProcessedEmailUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEmail
     */
    select?: ProcessedEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEmail
     */
    omit?: ProcessedEmailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedEmailInclude<ExtArgs> | null
    /**
     * The data needed to update a ProcessedEmail.
     */
    data: XOR<ProcessedEmailUpdateInput, ProcessedEmailUncheckedUpdateInput>
    /**
     * Choose, which ProcessedEmail to update.
     */
    where: ProcessedEmailWhereUniqueInput
  }

  /**
   * ProcessedEmail updateMany
   */
  export type ProcessedEmailUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProcessedEmails.
     */
    data: XOR<ProcessedEmailUpdateManyMutationInput, ProcessedEmailUncheckedUpdateManyInput>
    /**
     * Filter which ProcessedEmails to update
     */
    where?: ProcessedEmailWhereInput
    /**
     * Limit how many ProcessedEmails to update.
     */
    limit?: number
  }

  /**
   * ProcessedEmail updateManyAndReturn
   */
  export type ProcessedEmailUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEmail
     */
    select?: ProcessedEmailSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEmail
     */
    omit?: ProcessedEmailOmit<ExtArgs> | null
    /**
     * The data used to update ProcessedEmails.
     */
    data: XOR<ProcessedEmailUpdateManyMutationInput, ProcessedEmailUncheckedUpdateManyInput>
    /**
     * Filter which ProcessedEmails to update
     */
    where?: ProcessedEmailWhereInput
    /**
     * Limit how many ProcessedEmails to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedEmailIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProcessedEmail upsert
   */
  export type ProcessedEmailUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEmail
     */
    select?: ProcessedEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEmail
     */
    omit?: ProcessedEmailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedEmailInclude<ExtArgs> | null
    /**
     * The filter to search for the ProcessedEmail to update in case it exists.
     */
    where: ProcessedEmailWhereUniqueInput
    /**
     * In case the ProcessedEmail found by the `where` argument doesn't exist, create a new ProcessedEmail with this data.
     */
    create: XOR<ProcessedEmailCreateInput, ProcessedEmailUncheckedCreateInput>
    /**
     * In case the ProcessedEmail was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProcessedEmailUpdateInput, ProcessedEmailUncheckedUpdateInput>
  }

  /**
   * ProcessedEmail delete
   */
  export type ProcessedEmailDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEmail
     */
    select?: ProcessedEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEmail
     */
    omit?: ProcessedEmailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedEmailInclude<ExtArgs> | null
    /**
     * Filter which ProcessedEmail to delete.
     */
    where: ProcessedEmailWhereUniqueInput
  }

  /**
   * ProcessedEmail deleteMany
   */
  export type ProcessedEmailDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProcessedEmails to delete
     */
    where?: ProcessedEmailWhereInput
    /**
     * Limit how many ProcessedEmails to delete.
     */
    limit?: number
  }

  /**
   * ProcessedEmail without action
   */
  export type ProcessedEmailDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEmail
     */
    select?: ProcessedEmailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessedEmail
     */
    omit?: ProcessedEmailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedEmailInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const LedgerScalarFieldEnum: {
    id: 'id',
    userEmail: 'userEmail',
    date: 'date',
    description: 'description',
    amount: 'amount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LedgerScalarFieldEnum = (typeof LedgerScalarFieldEnum)[keyof typeof LedgerScalarFieldEnum]


  export const BankScalarFieldEnum: {
    id: 'id',
    userEmail: 'userEmail',
    date: 'date',
    description: 'description',
    amount: 'amount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BankScalarFieldEnum = (typeof BankScalarFieldEnum)[keyof typeof BankScalarFieldEnum]


  export const MatchedScalarFieldEnum: {
    id: 'id',
    userEmail: 'userEmail',
    ledgerId: 'ledgerId',
    bankId: 'bankId',
    bankTransaction: 'bankTransaction',
    description: 'description',
    amount: 'amount',
    date: 'date',
    matchScore: 'matchScore',
    createdAt: 'createdAt'
  };

  export type MatchedScalarFieldEnum = (typeof MatchedScalarFieldEnum)[keyof typeof MatchedScalarFieldEnum]


  export const GoogleAuthScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    expiryDate: 'expiryDate',
    scope: 'scope',
    tokenType: 'tokenType',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GoogleAuthScalarFieldEnum = (typeof GoogleAuthScalarFieldEnum)[keyof typeof GoogleAuthScalarFieldEnum]


  export const ProcessedEmailScalarFieldEnum: {
    id: 'id',
    gmailId: 'gmailId',
    userEmail: 'userEmail',
    subject: 'subject',
    from: 'from',
    attachmentCount: 'attachmentCount',
    processedAt: 'processedAt'
  };

  export type ProcessedEmailScalarFieldEnum = (typeof ProcessedEmailScalarFieldEnum)[keyof typeof ProcessedEmailScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    ledgers?: LedgerListRelationFilter
    banks?: BankListRelationFilter
    matched?: MatchedListRelationFilter
    processedEmails?: ProcessedEmailListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ledgers?: LedgerOrderByRelationAggregateInput
    banks?: BankOrderByRelationAggregateInput
    matched?: MatchedOrderByRelationAggregateInput
    processedEmails?: ProcessedEmailOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    ledgers?: LedgerListRelationFilter
    banks?: BankListRelationFilter
    matched?: MatchedListRelationFilter
    processedEmails?: ProcessedEmailListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type LedgerWhereInput = {
    AND?: LedgerWhereInput | LedgerWhereInput[]
    OR?: LedgerWhereInput[]
    NOT?: LedgerWhereInput | LedgerWhereInput[]
    id?: StringFilter<"Ledger"> | string
    userEmail?: StringFilter<"Ledger"> | string
    date?: DateTimeFilter<"Ledger"> | Date | string
    description?: StringFilter<"Ledger"> | string
    amount?: DecimalFilter<"Ledger"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Ledger"> | Date | string
    updatedAt?: DateTimeFilter<"Ledger"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    matched?: MatchedListRelationFilter
  }

  export type LedgerOrderByWithRelationInput = {
    id?: SortOrder
    userEmail?: SortOrder
    date?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    matched?: MatchedOrderByRelationAggregateInput
  }

  export type LedgerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LedgerWhereInput | LedgerWhereInput[]
    OR?: LedgerWhereInput[]
    NOT?: LedgerWhereInput | LedgerWhereInput[]
    userEmail?: StringFilter<"Ledger"> | string
    date?: DateTimeFilter<"Ledger"> | Date | string
    description?: StringFilter<"Ledger"> | string
    amount?: DecimalFilter<"Ledger"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Ledger"> | Date | string
    updatedAt?: DateTimeFilter<"Ledger"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    matched?: MatchedListRelationFilter
  }, "id">

  export type LedgerOrderByWithAggregationInput = {
    id?: SortOrder
    userEmail?: SortOrder
    date?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LedgerCountOrderByAggregateInput
    _avg?: LedgerAvgOrderByAggregateInput
    _max?: LedgerMaxOrderByAggregateInput
    _min?: LedgerMinOrderByAggregateInput
    _sum?: LedgerSumOrderByAggregateInput
  }

  export type LedgerScalarWhereWithAggregatesInput = {
    AND?: LedgerScalarWhereWithAggregatesInput | LedgerScalarWhereWithAggregatesInput[]
    OR?: LedgerScalarWhereWithAggregatesInput[]
    NOT?: LedgerScalarWhereWithAggregatesInput | LedgerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Ledger"> | string
    userEmail?: StringWithAggregatesFilter<"Ledger"> | string
    date?: DateTimeWithAggregatesFilter<"Ledger"> | Date | string
    description?: StringWithAggregatesFilter<"Ledger"> | string
    amount?: DecimalWithAggregatesFilter<"Ledger"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"Ledger"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Ledger"> | Date | string
  }

  export type BankWhereInput = {
    AND?: BankWhereInput | BankWhereInput[]
    OR?: BankWhereInput[]
    NOT?: BankWhereInput | BankWhereInput[]
    id?: StringFilter<"Bank"> | string
    userEmail?: StringFilter<"Bank"> | string
    date?: DateTimeFilter<"Bank"> | Date | string
    description?: StringFilter<"Bank"> | string
    amount?: DecimalFilter<"Bank"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Bank"> | Date | string
    updatedAt?: DateTimeFilter<"Bank"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    matched?: MatchedListRelationFilter
  }

  export type BankOrderByWithRelationInput = {
    id?: SortOrder
    userEmail?: SortOrder
    date?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    matched?: MatchedOrderByRelationAggregateInput
  }

  export type BankWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BankWhereInput | BankWhereInput[]
    OR?: BankWhereInput[]
    NOT?: BankWhereInput | BankWhereInput[]
    userEmail?: StringFilter<"Bank"> | string
    date?: DateTimeFilter<"Bank"> | Date | string
    description?: StringFilter<"Bank"> | string
    amount?: DecimalFilter<"Bank"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Bank"> | Date | string
    updatedAt?: DateTimeFilter<"Bank"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    matched?: MatchedListRelationFilter
  }, "id">

  export type BankOrderByWithAggregationInput = {
    id?: SortOrder
    userEmail?: SortOrder
    date?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BankCountOrderByAggregateInput
    _avg?: BankAvgOrderByAggregateInput
    _max?: BankMaxOrderByAggregateInput
    _min?: BankMinOrderByAggregateInput
    _sum?: BankSumOrderByAggregateInput
  }

  export type BankScalarWhereWithAggregatesInput = {
    AND?: BankScalarWhereWithAggregatesInput | BankScalarWhereWithAggregatesInput[]
    OR?: BankScalarWhereWithAggregatesInput[]
    NOT?: BankScalarWhereWithAggregatesInput | BankScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Bank"> | string
    userEmail?: StringWithAggregatesFilter<"Bank"> | string
    date?: DateTimeWithAggregatesFilter<"Bank"> | Date | string
    description?: StringWithAggregatesFilter<"Bank"> | string
    amount?: DecimalWithAggregatesFilter<"Bank"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"Bank"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Bank"> | Date | string
  }

  export type MatchedWhereInput = {
    AND?: MatchedWhereInput | MatchedWhereInput[]
    OR?: MatchedWhereInput[]
    NOT?: MatchedWhereInput | MatchedWhereInput[]
    id?: StringFilter<"Matched"> | string
    userEmail?: StringFilter<"Matched"> | string
    ledgerId?: StringFilter<"Matched"> | string
    bankId?: StringFilter<"Matched"> | string
    bankTransaction?: StringFilter<"Matched"> | string
    description?: StringFilter<"Matched"> | string
    amount?: DecimalFilter<"Matched"> | Decimal | DecimalJsLike | number | string
    date?: DateTimeFilter<"Matched"> | Date | string
    matchScore?: IntFilter<"Matched"> | number
    createdAt?: DateTimeFilter<"Matched"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    ledger?: XOR<LedgerScalarRelationFilter, LedgerWhereInput>
    bank?: XOR<BankScalarRelationFilter, BankWhereInput>
  }

  export type MatchedOrderByWithRelationInput = {
    id?: SortOrder
    userEmail?: SortOrder
    ledgerId?: SortOrder
    bankId?: SortOrder
    bankTransaction?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    date?: SortOrder
    matchScore?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    ledger?: LedgerOrderByWithRelationInput
    bank?: BankOrderByWithRelationInput
  }

  export type MatchedWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    ledgerId_bankId?: MatchedLedgerIdBankIdCompoundUniqueInput
    AND?: MatchedWhereInput | MatchedWhereInput[]
    OR?: MatchedWhereInput[]
    NOT?: MatchedWhereInput | MatchedWhereInput[]
    userEmail?: StringFilter<"Matched"> | string
    ledgerId?: StringFilter<"Matched"> | string
    bankId?: StringFilter<"Matched"> | string
    bankTransaction?: StringFilter<"Matched"> | string
    description?: StringFilter<"Matched"> | string
    amount?: DecimalFilter<"Matched"> | Decimal | DecimalJsLike | number | string
    date?: DateTimeFilter<"Matched"> | Date | string
    matchScore?: IntFilter<"Matched"> | number
    createdAt?: DateTimeFilter<"Matched"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    ledger?: XOR<LedgerScalarRelationFilter, LedgerWhereInput>
    bank?: XOR<BankScalarRelationFilter, BankWhereInput>
  }, "id" | "ledgerId_bankId">

  export type MatchedOrderByWithAggregationInput = {
    id?: SortOrder
    userEmail?: SortOrder
    ledgerId?: SortOrder
    bankId?: SortOrder
    bankTransaction?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    date?: SortOrder
    matchScore?: SortOrder
    createdAt?: SortOrder
    _count?: MatchedCountOrderByAggregateInput
    _avg?: MatchedAvgOrderByAggregateInput
    _max?: MatchedMaxOrderByAggregateInput
    _min?: MatchedMinOrderByAggregateInput
    _sum?: MatchedSumOrderByAggregateInput
  }

  export type MatchedScalarWhereWithAggregatesInput = {
    AND?: MatchedScalarWhereWithAggregatesInput | MatchedScalarWhereWithAggregatesInput[]
    OR?: MatchedScalarWhereWithAggregatesInput[]
    NOT?: MatchedScalarWhereWithAggregatesInput | MatchedScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Matched"> | string
    userEmail?: StringWithAggregatesFilter<"Matched"> | string
    ledgerId?: StringWithAggregatesFilter<"Matched"> | string
    bankId?: StringWithAggregatesFilter<"Matched"> | string
    bankTransaction?: StringWithAggregatesFilter<"Matched"> | string
    description?: StringWithAggregatesFilter<"Matched"> | string
    amount?: DecimalWithAggregatesFilter<"Matched"> | Decimal | DecimalJsLike | number | string
    date?: DateTimeWithAggregatesFilter<"Matched"> | Date | string
    matchScore?: IntWithAggregatesFilter<"Matched"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Matched"> | Date | string
  }

  export type GoogleAuthWhereInput = {
    AND?: GoogleAuthWhereInput | GoogleAuthWhereInput[]
    OR?: GoogleAuthWhereInput[]
    NOT?: GoogleAuthWhereInput | GoogleAuthWhereInput[]
    id?: StringFilter<"GoogleAuth"> | string
    email?: StringFilter<"GoogleAuth"> | string
    name?: StringFilter<"GoogleAuth"> | string
    accessToken?: StringFilter<"GoogleAuth"> | string
    refreshToken?: StringNullableFilter<"GoogleAuth"> | string | null
    expiryDate?: DateTimeNullableFilter<"GoogleAuth"> | Date | string | null
    scope?: StringFilter<"GoogleAuth"> | string
    tokenType?: StringFilter<"GoogleAuth"> | string
    createdAt?: DateTimeFilter<"GoogleAuth"> | Date | string
    updatedAt?: DateTimeFilter<"GoogleAuth"> | Date | string
  }

  export type GoogleAuthOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    expiryDate?: SortOrderInput | SortOrder
    scope?: SortOrder
    tokenType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoogleAuthWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: GoogleAuthWhereInput | GoogleAuthWhereInput[]
    OR?: GoogleAuthWhereInput[]
    NOT?: GoogleAuthWhereInput | GoogleAuthWhereInput[]
    name?: StringFilter<"GoogleAuth"> | string
    accessToken?: StringFilter<"GoogleAuth"> | string
    refreshToken?: StringNullableFilter<"GoogleAuth"> | string | null
    expiryDate?: DateTimeNullableFilter<"GoogleAuth"> | Date | string | null
    scope?: StringFilter<"GoogleAuth"> | string
    tokenType?: StringFilter<"GoogleAuth"> | string
    createdAt?: DateTimeFilter<"GoogleAuth"> | Date | string
    updatedAt?: DateTimeFilter<"GoogleAuth"> | Date | string
  }, "id" | "email">

  export type GoogleAuthOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    expiryDate?: SortOrderInput | SortOrder
    scope?: SortOrder
    tokenType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GoogleAuthCountOrderByAggregateInput
    _max?: GoogleAuthMaxOrderByAggregateInput
    _min?: GoogleAuthMinOrderByAggregateInput
  }

  export type GoogleAuthScalarWhereWithAggregatesInput = {
    AND?: GoogleAuthScalarWhereWithAggregatesInput | GoogleAuthScalarWhereWithAggregatesInput[]
    OR?: GoogleAuthScalarWhereWithAggregatesInput[]
    NOT?: GoogleAuthScalarWhereWithAggregatesInput | GoogleAuthScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GoogleAuth"> | string
    email?: StringWithAggregatesFilter<"GoogleAuth"> | string
    name?: StringWithAggregatesFilter<"GoogleAuth"> | string
    accessToken?: StringWithAggregatesFilter<"GoogleAuth"> | string
    refreshToken?: StringNullableWithAggregatesFilter<"GoogleAuth"> | string | null
    expiryDate?: DateTimeNullableWithAggregatesFilter<"GoogleAuth"> | Date | string | null
    scope?: StringWithAggregatesFilter<"GoogleAuth"> | string
    tokenType?: StringWithAggregatesFilter<"GoogleAuth"> | string
    createdAt?: DateTimeWithAggregatesFilter<"GoogleAuth"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GoogleAuth"> | Date | string
  }

  export type ProcessedEmailWhereInput = {
    AND?: ProcessedEmailWhereInput | ProcessedEmailWhereInput[]
    OR?: ProcessedEmailWhereInput[]
    NOT?: ProcessedEmailWhereInput | ProcessedEmailWhereInput[]
    id?: StringFilter<"ProcessedEmail"> | string
    gmailId?: StringFilter<"ProcessedEmail"> | string
    userEmail?: StringFilter<"ProcessedEmail"> | string
    subject?: StringFilter<"ProcessedEmail"> | string
    from?: StringFilter<"ProcessedEmail"> | string
    attachmentCount?: IntFilter<"ProcessedEmail"> | number
    processedAt?: DateTimeFilter<"ProcessedEmail"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ProcessedEmailOrderByWithRelationInput = {
    id?: SortOrder
    gmailId?: SortOrder
    userEmail?: SortOrder
    subject?: SortOrder
    from?: SortOrder
    attachmentCount?: SortOrder
    processedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ProcessedEmailWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    gmailId?: string
    AND?: ProcessedEmailWhereInput | ProcessedEmailWhereInput[]
    OR?: ProcessedEmailWhereInput[]
    NOT?: ProcessedEmailWhereInput | ProcessedEmailWhereInput[]
    userEmail?: StringFilter<"ProcessedEmail"> | string
    subject?: StringFilter<"ProcessedEmail"> | string
    from?: StringFilter<"ProcessedEmail"> | string
    attachmentCount?: IntFilter<"ProcessedEmail"> | number
    processedAt?: DateTimeFilter<"ProcessedEmail"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "gmailId">

  export type ProcessedEmailOrderByWithAggregationInput = {
    id?: SortOrder
    gmailId?: SortOrder
    userEmail?: SortOrder
    subject?: SortOrder
    from?: SortOrder
    attachmentCount?: SortOrder
    processedAt?: SortOrder
    _count?: ProcessedEmailCountOrderByAggregateInput
    _avg?: ProcessedEmailAvgOrderByAggregateInput
    _max?: ProcessedEmailMaxOrderByAggregateInput
    _min?: ProcessedEmailMinOrderByAggregateInput
    _sum?: ProcessedEmailSumOrderByAggregateInput
  }

  export type ProcessedEmailScalarWhereWithAggregatesInput = {
    AND?: ProcessedEmailScalarWhereWithAggregatesInput | ProcessedEmailScalarWhereWithAggregatesInput[]
    OR?: ProcessedEmailScalarWhereWithAggregatesInput[]
    NOT?: ProcessedEmailScalarWhereWithAggregatesInput | ProcessedEmailScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProcessedEmail"> | string
    gmailId?: StringWithAggregatesFilter<"ProcessedEmail"> | string
    userEmail?: StringWithAggregatesFilter<"ProcessedEmail"> | string
    subject?: StringWithAggregatesFilter<"ProcessedEmail"> | string
    from?: StringWithAggregatesFilter<"ProcessedEmail"> | string
    attachmentCount?: IntWithAggregatesFilter<"ProcessedEmail"> | number
    processedAt?: DateTimeWithAggregatesFilter<"ProcessedEmail"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ledgers?: LedgerCreateNestedManyWithoutUserInput
    banks?: BankCreateNestedManyWithoutUserInput
    matched?: MatchedCreateNestedManyWithoutUserInput
    processedEmails?: ProcessedEmailCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ledgers?: LedgerUncheckedCreateNestedManyWithoutUserInput
    banks?: BankUncheckedCreateNestedManyWithoutUserInput
    matched?: MatchedUncheckedCreateNestedManyWithoutUserInput
    processedEmails?: ProcessedEmailUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ledgers?: LedgerUpdateManyWithoutUserNestedInput
    banks?: BankUpdateManyWithoutUserNestedInput
    matched?: MatchedUpdateManyWithoutUserNestedInput
    processedEmails?: ProcessedEmailUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ledgers?: LedgerUncheckedUpdateManyWithoutUserNestedInput
    banks?: BankUncheckedUpdateManyWithoutUserNestedInput
    matched?: MatchedUncheckedUpdateManyWithoutUserNestedInput
    processedEmails?: ProcessedEmailUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerCreateInput = {
    id?: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutLedgersInput
    matched?: MatchedCreateNestedManyWithoutLedgerInput
  }

  export type LedgerUncheckedCreateInput = {
    id?: string
    userEmail: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    matched?: MatchedUncheckedCreateNestedManyWithoutLedgerInput
  }

  export type LedgerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLedgersNestedInput
    matched?: MatchedUpdateManyWithoutLedgerNestedInput
  }

  export type LedgerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matched?: MatchedUncheckedUpdateManyWithoutLedgerNestedInput
  }

  export type LedgerCreateManyInput = {
    id?: string
    userEmail: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LedgerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BankCreateInput = {
    id?: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBanksInput
    matched?: MatchedCreateNestedManyWithoutBankInput
  }

  export type BankUncheckedCreateInput = {
    id?: string
    userEmail: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    matched?: MatchedUncheckedCreateNestedManyWithoutBankInput
  }

  export type BankUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBanksNestedInput
    matched?: MatchedUpdateManyWithoutBankNestedInput
  }

  export type BankUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matched?: MatchedUncheckedUpdateManyWithoutBankNestedInput
  }

  export type BankCreateManyInput = {
    id?: string
    userEmail: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BankUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BankUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchedCreateInput = {
    id?: string
    bankTransaction: string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    matchScore?: number
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutMatchedInput
    ledger: LedgerCreateNestedOneWithoutMatchedInput
    bank: BankCreateNestedOneWithoutMatchedInput
  }

  export type MatchedUncheckedCreateInput = {
    id?: string
    userEmail: string
    ledgerId: string
    bankId: string
    bankTransaction: string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    matchScore?: number
    createdAt?: Date | string
  }

  export type MatchedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bankTransaction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    matchScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMatchedNestedInput
    ledger?: LedgerUpdateOneRequiredWithoutMatchedNestedInput
    bank?: BankUpdateOneRequiredWithoutMatchedNestedInput
  }

  export type MatchedUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    ledgerId?: StringFieldUpdateOperationsInput | string
    bankId?: StringFieldUpdateOperationsInput | string
    bankTransaction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    matchScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchedCreateManyInput = {
    id?: string
    userEmail: string
    ledgerId: string
    bankId: string
    bankTransaction: string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    matchScore?: number
    createdAt?: Date | string
  }

  export type MatchedUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    bankTransaction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    matchScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchedUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    ledgerId?: StringFieldUpdateOperationsInput | string
    bankId?: StringFieldUpdateOperationsInput | string
    bankTransaction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    matchScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoogleAuthCreateInput = {
    id?: string
    email: string
    name: string
    accessToken: string
    refreshToken?: string | null
    expiryDate?: Date | string | null
    scope: string
    tokenType: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoogleAuthUncheckedCreateInput = {
    id?: string
    email: string
    name: string
    accessToken: string
    refreshToken?: string | null
    expiryDate?: Date | string | null
    scope: string
    tokenType: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoogleAuthUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: StringFieldUpdateOperationsInput | string
    tokenType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoogleAuthUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: StringFieldUpdateOperationsInput | string
    tokenType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoogleAuthCreateManyInput = {
    id?: string
    email: string
    name: string
    accessToken: string
    refreshToken?: string | null
    expiryDate?: Date | string | null
    scope: string
    tokenType: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoogleAuthUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: StringFieldUpdateOperationsInput | string
    tokenType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoogleAuthUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: StringFieldUpdateOperationsInput | string
    tokenType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessedEmailCreateInput = {
    id?: string
    gmailId: string
    subject: string
    from: string
    attachmentCount?: number
    processedAt?: Date | string
    user: UserCreateNestedOneWithoutProcessedEmailsInput
  }

  export type ProcessedEmailUncheckedCreateInput = {
    id?: string
    gmailId: string
    userEmail: string
    subject: string
    from: string
    attachmentCount?: number
    processedAt?: Date | string
  }

  export type ProcessedEmailUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gmailId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    from?: StringFieldUpdateOperationsInput | string
    attachmentCount?: IntFieldUpdateOperationsInput | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProcessedEmailsNestedInput
  }

  export type ProcessedEmailUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gmailId?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    from?: StringFieldUpdateOperationsInput | string
    attachmentCount?: IntFieldUpdateOperationsInput | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessedEmailCreateManyInput = {
    id?: string
    gmailId: string
    userEmail: string
    subject: string
    from: string
    attachmentCount?: number
    processedAt?: Date | string
  }

  export type ProcessedEmailUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    gmailId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    from?: StringFieldUpdateOperationsInput | string
    attachmentCount?: IntFieldUpdateOperationsInput | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessedEmailUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    gmailId?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    from?: StringFieldUpdateOperationsInput | string
    attachmentCount?: IntFieldUpdateOperationsInput | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type LedgerListRelationFilter = {
    every?: LedgerWhereInput
    some?: LedgerWhereInput
    none?: LedgerWhereInput
  }

  export type BankListRelationFilter = {
    every?: BankWhereInput
    some?: BankWhereInput
    none?: BankWhereInput
  }

  export type MatchedListRelationFilter = {
    every?: MatchedWhereInput
    some?: MatchedWhereInput
    none?: MatchedWhereInput
  }

  export type ProcessedEmailListRelationFilter = {
    every?: ProcessedEmailWhereInput
    some?: ProcessedEmailWhereInput
    none?: ProcessedEmailWhereInput
  }

  export type LedgerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BankOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MatchedOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProcessedEmailOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type LedgerCountOrderByAggregateInput = {
    id?: SortOrder
    userEmail?: SortOrder
    date?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LedgerAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type LedgerMaxOrderByAggregateInput = {
    id?: SortOrder
    userEmail?: SortOrder
    date?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LedgerMinOrderByAggregateInput = {
    id?: SortOrder
    userEmail?: SortOrder
    date?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LedgerSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type BankCountOrderByAggregateInput = {
    id?: SortOrder
    userEmail?: SortOrder
    date?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BankAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type BankMaxOrderByAggregateInput = {
    id?: SortOrder
    userEmail?: SortOrder
    date?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BankMinOrderByAggregateInput = {
    id?: SortOrder
    userEmail?: SortOrder
    date?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BankSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type LedgerScalarRelationFilter = {
    is?: LedgerWhereInput
    isNot?: LedgerWhereInput
  }

  export type BankScalarRelationFilter = {
    is?: BankWhereInput
    isNot?: BankWhereInput
  }

  export type MatchedLedgerIdBankIdCompoundUniqueInput = {
    ledgerId: string
    bankId: string
  }

  export type MatchedCountOrderByAggregateInput = {
    id?: SortOrder
    userEmail?: SortOrder
    ledgerId?: SortOrder
    bankId?: SortOrder
    bankTransaction?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    date?: SortOrder
    matchScore?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchedAvgOrderByAggregateInput = {
    amount?: SortOrder
    matchScore?: SortOrder
  }

  export type MatchedMaxOrderByAggregateInput = {
    id?: SortOrder
    userEmail?: SortOrder
    ledgerId?: SortOrder
    bankId?: SortOrder
    bankTransaction?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    date?: SortOrder
    matchScore?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchedMinOrderByAggregateInput = {
    id?: SortOrder
    userEmail?: SortOrder
    ledgerId?: SortOrder
    bankId?: SortOrder
    bankTransaction?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    date?: SortOrder
    matchScore?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchedSumOrderByAggregateInput = {
    amount?: SortOrder
    matchScore?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type GoogleAuthCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    expiryDate?: SortOrder
    scope?: SortOrder
    tokenType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoogleAuthMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    expiryDate?: SortOrder
    scope?: SortOrder
    tokenType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoogleAuthMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    expiryDate?: SortOrder
    scope?: SortOrder
    tokenType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ProcessedEmailCountOrderByAggregateInput = {
    id?: SortOrder
    gmailId?: SortOrder
    userEmail?: SortOrder
    subject?: SortOrder
    from?: SortOrder
    attachmentCount?: SortOrder
    processedAt?: SortOrder
  }

  export type ProcessedEmailAvgOrderByAggregateInput = {
    attachmentCount?: SortOrder
  }

  export type ProcessedEmailMaxOrderByAggregateInput = {
    id?: SortOrder
    gmailId?: SortOrder
    userEmail?: SortOrder
    subject?: SortOrder
    from?: SortOrder
    attachmentCount?: SortOrder
    processedAt?: SortOrder
  }

  export type ProcessedEmailMinOrderByAggregateInput = {
    id?: SortOrder
    gmailId?: SortOrder
    userEmail?: SortOrder
    subject?: SortOrder
    from?: SortOrder
    attachmentCount?: SortOrder
    processedAt?: SortOrder
  }

  export type ProcessedEmailSumOrderByAggregateInput = {
    attachmentCount?: SortOrder
  }

  export type LedgerCreateNestedManyWithoutUserInput = {
    create?: XOR<LedgerCreateWithoutUserInput, LedgerUncheckedCreateWithoutUserInput> | LedgerCreateWithoutUserInput[] | LedgerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LedgerCreateOrConnectWithoutUserInput | LedgerCreateOrConnectWithoutUserInput[]
    createMany?: LedgerCreateManyUserInputEnvelope
    connect?: LedgerWhereUniqueInput | LedgerWhereUniqueInput[]
  }

  export type BankCreateNestedManyWithoutUserInput = {
    create?: XOR<BankCreateWithoutUserInput, BankUncheckedCreateWithoutUserInput> | BankCreateWithoutUserInput[] | BankUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BankCreateOrConnectWithoutUserInput | BankCreateOrConnectWithoutUserInput[]
    createMany?: BankCreateManyUserInputEnvelope
    connect?: BankWhereUniqueInput | BankWhereUniqueInput[]
  }

  export type MatchedCreateNestedManyWithoutUserInput = {
    create?: XOR<MatchedCreateWithoutUserInput, MatchedUncheckedCreateWithoutUserInput> | MatchedCreateWithoutUserInput[] | MatchedUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MatchedCreateOrConnectWithoutUserInput | MatchedCreateOrConnectWithoutUserInput[]
    createMany?: MatchedCreateManyUserInputEnvelope
    connect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
  }

  export type ProcessedEmailCreateNestedManyWithoutUserInput = {
    create?: XOR<ProcessedEmailCreateWithoutUserInput, ProcessedEmailUncheckedCreateWithoutUserInput> | ProcessedEmailCreateWithoutUserInput[] | ProcessedEmailUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProcessedEmailCreateOrConnectWithoutUserInput | ProcessedEmailCreateOrConnectWithoutUserInput[]
    createMany?: ProcessedEmailCreateManyUserInputEnvelope
    connect?: ProcessedEmailWhereUniqueInput | ProcessedEmailWhereUniqueInput[]
  }

  export type LedgerUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LedgerCreateWithoutUserInput, LedgerUncheckedCreateWithoutUserInput> | LedgerCreateWithoutUserInput[] | LedgerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LedgerCreateOrConnectWithoutUserInput | LedgerCreateOrConnectWithoutUserInput[]
    createMany?: LedgerCreateManyUserInputEnvelope
    connect?: LedgerWhereUniqueInput | LedgerWhereUniqueInput[]
  }

  export type BankUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BankCreateWithoutUserInput, BankUncheckedCreateWithoutUserInput> | BankCreateWithoutUserInput[] | BankUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BankCreateOrConnectWithoutUserInput | BankCreateOrConnectWithoutUserInput[]
    createMany?: BankCreateManyUserInputEnvelope
    connect?: BankWhereUniqueInput | BankWhereUniqueInput[]
  }

  export type MatchedUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MatchedCreateWithoutUserInput, MatchedUncheckedCreateWithoutUserInput> | MatchedCreateWithoutUserInput[] | MatchedUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MatchedCreateOrConnectWithoutUserInput | MatchedCreateOrConnectWithoutUserInput[]
    createMany?: MatchedCreateManyUserInputEnvelope
    connect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
  }

  export type ProcessedEmailUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ProcessedEmailCreateWithoutUserInput, ProcessedEmailUncheckedCreateWithoutUserInput> | ProcessedEmailCreateWithoutUserInput[] | ProcessedEmailUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProcessedEmailCreateOrConnectWithoutUserInput | ProcessedEmailCreateOrConnectWithoutUserInput[]
    createMany?: ProcessedEmailCreateManyUserInputEnvelope
    connect?: ProcessedEmailWhereUniqueInput | ProcessedEmailWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LedgerUpdateManyWithoutUserNestedInput = {
    create?: XOR<LedgerCreateWithoutUserInput, LedgerUncheckedCreateWithoutUserInput> | LedgerCreateWithoutUserInput[] | LedgerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LedgerCreateOrConnectWithoutUserInput | LedgerCreateOrConnectWithoutUserInput[]
    upsert?: LedgerUpsertWithWhereUniqueWithoutUserInput | LedgerUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LedgerCreateManyUserInputEnvelope
    set?: LedgerWhereUniqueInput | LedgerWhereUniqueInput[]
    disconnect?: LedgerWhereUniqueInput | LedgerWhereUniqueInput[]
    delete?: LedgerWhereUniqueInput | LedgerWhereUniqueInput[]
    connect?: LedgerWhereUniqueInput | LedgerWhereUniqueInput[]
    update?: LedgerUpdateWithWhereUniqueWithoutUserInput | LedgerUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LedgerUpdateManyWithWhereWithoutUserInput | LedgerUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LedgerScalarWhereInput | LedgerScalarWhereInput[]
  }

  export type BankUpdateManyWithoutUserNestedInput = {
    create?: XOR<BankCreateWithoutUserInput, BankUncheckedCreateWithoutUserInput> | BankCreateWithoutUserInput[] | BankUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BankCreateOrConnectWithoutUserInput | BankCreateOrConnectWithoutUserInput[]
    upsert?: BankUpsertWithWhereUniqueWithoutUserInput | BankUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BankCreateManyUserInputEnvelope
    set?: BankWhereUniqueInput | BankWhereUniqueInput[]
    disconnect?: BankWhereUniqueInput | BankWhereUniqueInput[]
    delete?: BankWhereUniqueInput | BankWhereUniqueInput[]
    connect?: BankWhereUniqueInput | BankWhereUniqueInput[]
    update?: BankUpdateWithWhereUniqueWithoutUserInput | BankUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BankUpdateManyWithWhereWithoutUserInput | BankUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BankScalarWhereInput | BankScalarWhereInput[]
  }

  export type MatchedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MatchedCreateWithoutUserInput, MatchedUncheckedCreateWithoutUserInput> | MatchedCreateWithoutUserInput[] | MatchedUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MatchedCreateOrConnectWithoutUserInput | MatchedCreateOrConnectWithoutUserInput[]
    upsert?: MatchedUpsertWithWhereUniqueWithoutUserInput | MatchedUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MatchedCreateManyUserInputEnvelope
    set?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    disconnect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    delete?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    connect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    update?: MatchedUpdateWithWhereUniqueWithoutUserInput | MatchedUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MatchedUpdateManyWithWhereWithoutUserInput | MatchedUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MatchedScalarWhereInput | MatchedScalarWhereInput[]
  }

  export type ProcessedEmailUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProcessedEmailCreateWithoutUserInput, ProcessedEmailUncheckedCreateWithoutUserInput> | ProcessedEmailCreateWithoutUserInput[] | ProcessedEmailUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProcessedEmailCreateOrConnectWithoutUserInput | ProcessedEmailCreateOrConnectWithoutUserInput[]
    upsert?: ProcessedEmailUpsertWithWhereUniqueWithoutUserInput | ProcessedEmailUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProcessedEmailCreateManyUserInputEnvelope
    set?: ProcessedEmailWhereUniqueInput | ProcessedEmailWhereUniqueInput[]
    disconnect?: ProcessedEmailWhereUniqueInput | ProcessedEmailWhereUniqueInput[]
    delete?: ProcessedEmailWhereUniqueInput | ProcessedEmailWhereUniqueInput[]
    connect?: ProcessedEmailWhereUniqueInput | ProcessedEmailWhereUniqueInput[]
    update?: ProcessedEmailUpdateWithWhereUniqueWithoutUserInput | ProcessedEmailUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProcessedEmailUpdateManyWithWhereWithoutUserInput | ProcessedEmailUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProcessedEmailScalarWhereInput | ProcessedEmailScalarWhereInput[]
  }

  export type LedgerUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LedgerCreateWithoutUserInput, LedgerUncheckedCreateWithoutUserInput> | LedgerCreateWithoutUserInput[] | LedgerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LedgerCreateOrConnectWithoutUserInput | LedgerCreateOrConnectWithoutUserInput[]
    upsert?: LedgerUpsertWithWhereUniqueWithoutUserInput | LedgerUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LedgerCreateManyUserInputEnvelope
    set?: LedgerWhereUniqueInput | LedgerWhereUniqueInput[]
    disconnect?: LedgerWhereUniqueInput | LedgerWhereUniqueInput[]
    delete?: LedgerWhereUniqueInput | LedgerWhereUniqueInput[]
    connect?: LedgerWhereUniqueInput | LedgerWhereUniqueInput[]
    update?: LedgerUpdateWithWhereUniqueWithoutUserInput | LedgerUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LedgerUpdateManyWithWhereWithoutUserInput | LedgerUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LedgerScalarWhereInput | LedgerScalarWhereInput[]
  }

  export type BankUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BankCreateWithoutUserInput, BankUncheckedCreateWithoutUserInput> | BankCreateWithoutUserInput[] | BankUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BankCreateOrConnectWithoutUserInput | BankCreateOrConnectWithoutUserInput[]
    upsert?: BankUpsertWithWhereUniqueWithoutUserInput | BankUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BankCreateManyUserInputEnvelope
    set?: BankWhereUniqueInput | BankWhereUniqueInput[]
    disconnect?: BankWhereUniqueInput | BankWhereUniqueInput[]
    delete?: BankWhereUniqueInput | BankWhereUniqueInput[]
    connect?: BankWhereUniqueInput | BankWhereUniqueInput[]
    update?: BankUpdateWithWhereUniqueWithoutUserInput | BankUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BankUpdateManyWithWhereWithoutUserInput | BankUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BankScalarWhereInput | BankScalarWhereInput[]
  }

  export type MatchedUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MatchedCreateWithoutUserInput, MatchedUncheckedCreateWithoutUserInput> | MatchedCreateWithoutUserInput[] | MatchedUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MatchedCreateOrConnectWithoutUserInput | MatchedCreateOrConnectWithoutUserInput[]
    upsert?: MatchedUpsertWithWhereUniqueWithoutUserInput | MatchedUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MatchedCreateManyUserInputEnvelope
    set?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    disconnect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    delete?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    connect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    update?: MatchedUpdateWithWhereUniqueWithoutUserInput | MatchedUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MatchedUpdateManyWithWhereWithoutUserInput | MatchedUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MatchedScalarWhereInput | MatchedScalarWhereInput[]
  }

  export type ProcessedEmailUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProcessedEmailCreateWithoutUserInput, ProcessedEmailUncheckedCreateWithoutUserInput> | ProcessedEmailCreateWithoutUserInput[] | ProcessedEmailUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProcessedEmailCreateOrConnectWithoutUserInput | ProcessedEmailCreateOrConnectWithoutUserInput[]
    upsert?: ProcessedEmailUpsertWithWhereUniqueWithoutUserInput | ProcessedEmailUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProcessedEmailCreateManyUserInputEnvelope
    set?: ProcessedEmailWhereUniqueInput | ProcessedEmailWhereUniqueInput[]
    disconnect?: ProcessedEmailWhereUniqueInput | ProcessedEmailWhereUniqueInput[]
    delete?: ProcessedEmailWhereUniqueInput | ProcessedEmailWhereUniqueInput[]
    connect?: ProcessedEmailWhereUniqueInput | ProcessedEmailWhereUniqueInput[]
    update?: ProcessedEmailUpdateWithWhereUniqueWithoutUserInput | ProcessedEmailUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProcessedEmailUpdateManyWithWhereWithoutUserInput | ProcessedEmailUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProcessedEmailScalarWhereInput | ProcessedEmailScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutLedgersInput = {
    create?: XOR<UserCreateWithoutLedgersInput, UserUncheckedCreateWithoutLedgersInput>
    connectOrCreate?: UserCreateOrConnectWithoutLedgersInput
    connect?: UserWhereUniqueInput
  }

  export type MatchedCreateNestedManyWithoutLedgerInput = {
    create?: XOR<MatchedCreateWithoutLedgerInput, MatchedUncheckedCreateWithoutLedgerInput> | MatchedCreateWithoutLedgerInput[] | MatchedUncheckedCreateWithoutLedgerInput[]
    connectOrCreate?: MatchedCreateOrConnectWithoutLedgerInput | MatchedCreateOrConnectWithoutLedgerInput[]
    createMany?: MatchedCreateManyLedgerInputEnvelope
    connect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
  }

  export type MatchedUncheckedCreateNestedManyWithoutLedgerInput = {
    create?: XOR<MatchedCreateWithoutLedgerInput, MatchedUncheckedCreateWithoutLedgerInput> | MatchedCreateWithoutLedgerInput[] | MatchedUncheckedCreateWithoutLedgerInput[]
    connectOrCreate?: MatchedCreateOrConnectWithoutLedgerInput | MatchedCreateOrConnectWithoutLedgerInput[]
    createMany?: MatchedCreateManyLedgerInputEnvelope
    connect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type UserUpdateOneRequiredWithoutLedgersNestedInput = {
    create?: XOR<UserCreateWithoutLedgersInput, UserUncheckedCreateWithoutLedgersInput>
    connectOrCreate?: UserCreateOrConnectWithoutLedgersInput
    upsert?: UserUpsertWithoutLedgersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLedgersInput, UserUpdateWithoutLedgersInput>, UserUncheckedUpdateWithoutLedgersInput>
  }

  export type MatchedUpdateManyWithoutLedgerNestedInput = {
    create?: XOR<MatchedCreateWithoutLedgerInput, MatchedUncheckedCreateWithoutLedgerInput> | MatchedCreateWithoutLedgerInput[] | MatchedUncheckedCreateWithoutLedgerInput[]
    connectOrCreate?: MatchedCreateOrConnectWithoutLedgerInput | MatchedCreateOrConnectWithoutLedgerInput[]
    upsert?: MatchedUpsertWithWhereUniqueWithoutLedgerInput | MatchedUpsertWithWhereUniqueWithoutLedgerInput[]
    createMany?: MatchedCreateManyLedgerInputEnvelope
    set?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    disconnect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    delete?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    connect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    update?: MatchedUpdateWithWhereUniqueWithoutLedgerInput | MatchedUpdateWithWhereUniqueWithoutLedgerInput[]
    updateMany?: MatchedUpdateManyWithWhereWithoutLedgerInput | MatchedUpdateManyWithWhereWithoutLedgerInput[]
    deleteMany?: MatchedScalarWhereInput | MatchedScalarWhereInput[]
  }

  export type MatchedUncheckedUpdateManyWithoutLedgerNestedInput = {
    create?: XOR<MatchedCreateWithoutLedgerInput, MatchedUncheckedCreateWithoutLedgerInput> | MatchedCreateWithoutLedgerInput[] | MatchedUncheckedCreateWithoutLedgerInput[]
    connectOrCreate?: MatchedCreateOrConnectWithoutLedgerInput | MatchedCreateOrConnectWithoutLedgerInput[]
    upsert?: MatchedUpsertWithWhereUniqueWithoutLedgerInput | MatchedUpsertWithWhereUniqueWithoutLedgerInput[]
    createMany?: MatchedCreateManyLedgerInputEnvelope
    set?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    disconnect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    delete?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    connect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    update?: MatchedUpdateWithWhereUniqueWithoutLedgerInput | MatchedUpdateWithWhereUniqueWithoutLedgerInput[]
    updateMany?: MatchedUpdateManyWithWhereWithoutLedgerInput | MatchedUpdateManyWithWhereWithoutLedgerInput[]
    deleteMany?: MatchedScalarWhereInput | MatchedScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutBanksInput = {
    create?: XOR<UserCreateWithoutBanksInput, UserUncheckedCreateWithoutBanksInput>
    connectOrCreate?: UserCreateOrConnectWithoutBanksInput
    connect?: UserWhereUniqueInput
  }

  export type MatchedCreateNestedManyWithoutBankInput = {
    create?: XOR<MatchedCreateWithoutBankInput, MatchedUncheckedCreateWithoutBankInput> | MatchedCreateWithoutBankInput[] | MatchedUncheckedCreateWithoutBankInput[]
    connectOrCreate?: MatchedCreateOrConnectWithoutBankInput | MatchedCreateOrConnectWithoutBankInput[]
    createMany?: MatchedCreateManyBankInputEnvelope
    connect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
  }

  export type MatchedUncheckedCreateNestedManyWithoutBankInput = {
    create?: XOR<MatchedCreateWithoutBankInput, MatchedUncheckedCreateWithoutBankInput> | MatchedCreateWithoutBankInput[] | MatchedUncheckedCreateWithoutBankInput[]
    connectOrCreate?: MatchedCreateOrConnectWithoutBankInput | MatchedCreateOrConnectWithoutBankInput[]
    createMany?: MatchedCreateManyBankInputEnvelope
    connect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutBanksNestedInput = {
    create?: XOR<UserCreateWithoutBanksInput, UserUncheckedCreateWithoutBanksInput>
    connectOrCreate?: UserCreateOrConnectWithoutBanksInput
    upsert?: UserUpsertWithoutBanksInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBanksInput, UserUpdateWithoutBanksInput>, UserUncheckedUpdateWithoutBanksInput>
  }

  export type MatchedUpdateManyWithoutBankNestedInput = {
    create?: XOR<MatchedCreateWithoutBankInput, MatchedUncheckedCreateWithoutBankInput> | MatchedCreateWithoutBankInput[] | MatchedUncheckedCreateWithoutBankInput[]
    connectOrCreate?: MatchedCreateOrConnectWithoutBankInput | MatchedCreateOrConnectWithoutBankInput[]
    upsert?: MatchedUpsertWithWhereUniqueWithoutBankInput | MatchedUpsertWithWhereUniqueWithoutBankInput[]
    createMany?: MatchedCreateManyBankInputEnvelope
    set?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    disconnect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    delete?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    connect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    update?: MatchedUpdateWithWhereUniqueWithoutBankInput | MatchedUpdateWithWhereUniqueWithoutBankInput[]
    updateMany?: MatchedUpdateManyWithWhereWithoutBankInput | MatchedUpdateManyWithWhereWithoutBankInput[]
    deleteMany?: MatchedScalarWhereInput | MatchedScalarWhereInput[]
  }

  export type MatchedUncheckedUpdateManyWithoutBankNestedInput = {
    create?: XOR<MatchedCreateWithoutBankInput, MatchedUncheckedCreateWithoutBankInput> | MatchedCreateWithoutBankInput[] | MatchedUncheckedCreateWithoutBankInput[]
    connectOrCreate?: MatchedCreateOrConnectWithoutBankInput | MatchedCreateOrConnectWithoutBankInput[]
    upsert?: MatchedUpsertWithWhereUniqueWithoutBankInput | MatchedUpsertWithWhereUniqueWithoutBankInput[]
    createMany?: MatchedCreateManyBankInputEnvelope
    set?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    disconnect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    delete?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    connect?: MatchedWhereUniqueInput | MatchedWhereUniqueInput[]
    update?: MatchedUpdateWithWhereUniqueWithoutBankInput | MatchedUpdateWithWhereUniqueWithoutBankInput[]
    updateMany?: MatchedUpdateManyWithWhereWithoutBankInput | MatchedUpdateManyWithWhereWithoutBankInput[]
    deleteMany?: MatchedScalarWhereInput | MatchedScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutMatchedInput = {
    create?: XOR<UserCreateWithoutMatchedInput, UserUncheckedCreateWithoutMatchedInput>
    connectOrCreate?: UserCreateOrConnectWithoutMatchedInput
    connect?: UserWhereUniqueInput
  }

  export type LedgerCreateNestedOneWithoutMatchedInput = {
    create?: XOR<LedgerCreateWithoutMatchedInput, LedgerUncheckedCreateWithoutMatchedInput>
    connectOrCreate?: LedgerCreateOrConnectWithoutMatchedInput
    connect?: LedgerWhereUniqueInput
  }

  export type BankCreateNestedOneWithoutMatchedInput = {
    create?: XOR<BankCreateWithoutMatchedInput, BankUncheckedCreateWithoutMatchedInput>
    connectOrCreate?: BankCreateOrConnectWithoutMatchedInput
    connect?: BankWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutMatchedNestedInput = {
    create?: XOR<UserCreateWithoutMatchedInput, UserUncheckedCreateWithoutMatchedInput>
    connectOrCreate?: UserCreateOrConnectWithoutMatchedInput
    upsert?: UserUpsertWithoutMatchedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMatchedInput, UserUpdateWithoutMatchedInput>, UserUncheckedUpdateWithoutMatchedInput>
  }

  export type LedgerUpdateOneRequiredWithoutMatchedNestedInput = {
    create?: XOR<LedgerCreateWithoutMatchedInput, LedgerUncheckedCreateWithoutMatchedInput>
    connectOrCreate?: LedgerCreateOrConnectWithoutMatchedInput
    upsert?: LedgerUpsertWithoutMatchedInput
    connect?: LedgerWhereUniqueInput
    update?: XOR<XOR<LedgerUpdateToOneWithWhereWithoutMatchedInput, LedgerUpdateWithoutMatchedInput>, LedgerUncheckedUpdateWithoutMatchedInput>
  }

  export type BankUpdateOneRequiredWithoutMatchedNestedInput = {
    create?: XOR<BankCreateWithoutMatchedInput, BankUncheckedCreateWithoutMatchedInput>
    connectOrCreate?: BankCreateOrConnectWithoutMatchedInput
    upsert?: BankUpsertWithoutMatchedInput
    connect?: BankWhereUniqueInput
    update?: XOR<XOR<BankUpdateToOneWithWhereWithoutMatchedInput, BankUpdateWithoutMatchedInput>, BankUncheckedUpdateWithoutMatchedInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserCreateNestedOneWithoutProcessedEmailsInput = {
    create?: XOR<UserCreateWithoutProcessedEmailsInput, UserUncheckedCreateWithoutProcessedEmailsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProcessedEmailsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutProcessedEmailsNestedInput = {
    create?: XOR<UserCreateWithoutProcessedEmailsInput, UserUncheckedCreateWithoutProcessedEmailsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProcessedEmailsInput
    upsert?: UserUpsertWithoutProcessedEmailsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProcessedEmailsInput, UserUpdateWithoutProcessedEmailsInput>, UserUncheckedUpdateWithoutProcessedEmailsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type LedgerCreateWithoutUserInput = {
    id?: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    matched?: MatchedCreateNestedManyWithoutLedgerInput
  }

  export type LedgerUncheckedCreateWithoutUserInput = {
    id?: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    matched?: MatchedUncheckedCreateNestedManyWithoutLedgerInput
  }

  export type LedgerCreateOrConnectWithoutUserInput = {
    where: LedgerWhereUniqueInput
    create: XOR<LedgerCreateWithoutUserInput, LedgerUncheckedCreateWithoutUserInput>
  }

  export type LedgerCreateManyUserInputEnvelope = {
    data: LedgerCreateManyUserInput | LedgerCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BankCreateWithoutUserInput = {
    id?: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    matched?: MatchedCreateNestedManyWithoutBankInput
  }

  export type BankUncheckedCreateWithoutUserInput = {
    id?: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    matched?: MatchedUncheckedCreateNestedManyWithoutBankInput
  }

  export type BankCreateOrConnectWithoutUserInput = {
    where: BankWhereUniqueInput
    create: XOR<BankCreateWithoutUserInput, BankUncheckedCreateWithoutUserInput>
  }

  export type BankCreateManyUserInputEnvelope = {
    data: BankCreateManyUserInput | BankCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MatchedCreateWithoutUserInput = {
    id?: string
    bankTransaction: string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    matchScore?: number
    createdAt?: Date | string
    ledger: LedgerCreateNestedOneWithoutMatchedInput
    bank: BankCreateNestedOneWithoutMatchedInput
  }

  export type MatchedUncheckedCreateWithoutUserInput = {
    id?: string
    ledgerId: string
    bankId: string
    bankTransaction: string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    matchScore?: number
    createdAt?: Date | string
  }

  export type MatchedCreateOrConnectWithoutUserInput = {
    where: MatchedWhereUniqueInput
    create: XOR<MatchedCreateWithoutUserInput, MatchedUncheckedCreateWithoutUserInput>
  }

  export type MatchedCreateManyUserInputEnvelope = {
    data: MatchedCreateManyUserInput | MatchedCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProcessedEmailCreateWithoutUserInput = {
    id?: string
    gmailId: string
    subject: string
    from: string
    attachmentCount?: number
    processedAt?: Date | string
  }

  export type ProcessedEmailUncheckedCreateWithoutUserInput = {
    id?: string
    gmailId: string
    subject: string
    from: string
    attachmentCount?: number
    processedAt?: Date | string
  }

  export type ProcessedEmailCreateOrConnectWithoutUserInput = {
    where: ProcessedEmailWhereUniqueInput
    create: XOR<ProcessedEmailCreateWithoutUserInput, ProcessedEmailUncheckedCreateWithoutUserInput>
  }

  export type ProcessedEmailCreateManyUserInputEnvelope = {
    data: ProcessedEmailCreateManyUserInput | ProcessedEmailCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type LedgerUpsertWithWhereUniqueWithoutUserInput = {
    where: LedgerWhereUniqueInput
    update: XOR<LedgerUpdateWithoutUserInput, LedgerUncheckedUpdateWithoutUserInput>
    create: XOR<LedgerCreateWithoutUserInput, LedgerUncheckedCreateWithoutUserInput>
  }

  export type LedgerUpdateWithWhereUniqueWithoutUserInput = {
    where: LedgerWhereUniqueInput
    data: XOR<LedgerUpdateWithoutUserInput, LedgerUncheckedUpdateWithoutUserInput>
  }

  export type LedgerUpdateManyWithWhereWithoutUserInput = {
    where: LedgerScalarWhereInput
    data: XOR<LedgerUpdateManyMutationInput, LedgerUncheckedUpdateManyWithoutUserInput>
  }

  export type LedgerScalarWhereInput = {
    AND?: LedgerScalarWhereInput | LedgerScalarWhereInput[]
    OR?: LedgerScalarWhereInput[]
    NOT?: LedgerScalarWhereInput | LedgerScalarWhereInput[]
    id?: StringFilter<"Ledger"> | string
    userEmail?: StringFilter<"Ledger"> | string
    date?: DateTimeFilter<"Ledger"> | Date | string
    description?: StringFilter<"Ledger"> | string
    amount?: DecimalFilter<"Ledger"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Ledger"> | Date | string
    updatedAt?: DateTimeFilter<"Ledger"> | Date | string
  }

  export type BankUpsertWithWhereUniqueWithoutUserInput = {
    where: BankWhereUniqueInput
    update: XOR<BankUpdateWithoutUserInput, BankUncheckedUpdateWithoutUserInput>
    create: XOR<BankCreateWithoutUserInput, BankUncheckedCreateWithoutUserInput>
  }

  export type BankUpdateWithWhereUniqueWithoutUserInput = {
    where: BankWhereUniqueInput
    data: XOR<BankUpdateWithoutUserInput, BankUncheckedUpdateWithoutUserInput>
  }

  export type BankUpdateManyWithWhereWithoutUserInput = {
    where: BankScalarWhereInput
    data: XOR<BankUpdateManyMutationInput, BankUncheckedUpdateManyWithoutUserInput>
  }

  export type BankScalarWhereInput = {
    AND?: BankScalarWhereInput | BankScalarWhereInput[]
    OR?: BankScalarWhereInput[]
    NOT?: BankScalarWhereInput | BankScalarWhereInput[]
    id?: StringFilter<"Bank"> | string
    userEmail?: StringFilter<"Bank"> | string
    date?: DateTimeFilter<"Bank"> | Date | string
    description?: StringFilter<"Bank"> | string
    amount?: DecimalFilter<"Bank"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Bank"> | Date | string
    updatedAt?: DateTimeFilter<"Bank"> | Date | string
  }

  export type MatchedUpsertWithWhereUniqueWithoutUserInput = {
    where: MatchedWhereUniqueInput
    update: XOR<MatchedUpdateWithoutUserInput, MatchedUncheckedUpdateWithoutUserInput>
    create: XOR<MatchedCreateWithoutUserInput, MatchedUncheckedCreateWithoutUserInput>
  }

  export type MatchedUpdateWithWhereUniqueWithoutUserInput = {
    where: MatchedWhereUniqueInput
    data: XOR<MatchedUpdateWithoutUserInput, MatchedUncheckedUpdateWithoutUserInput>
  }

  export type MatchedUpdateManyWithWhereWithoutUserInput = {
    where: MatchedScalarWhereInput
    data: XOR<MatchedUpdateManyMutationInput, MatchedUncheckedUpdateManyWithoutUserInput>
  }

  export type MatchedScalarWhereInput = {
    AND?: MatchedScalarWhereInput | MatchedScalarWhereInput[]
    OR?: MatchedScalarWhereInput[]
    NOT?: MatchedScalarWhereInput | MatchedScalarWhereInput[]
    id?: StringFilter<"Matched"> | string
    userEmail?: StringFilter<"Matched"> | string
    ledgerId?: StringFilter<"Matched"> | string
    bankId?: StringFilter<"Matched"> | string
    bankTransaction?: StringFilter<"Matched"> | string
    description?: StringFilter<"Matched"> | string
    amount?: DecimalFilter<"Matched"> | Decimal | DecimalJsLike | number | string
    date?: DateTimeFilter<"Matched"> | Date | string
    matchScore?: IntFilter<"Matched"> | number
    createdAt?: DateTimeFilter<"Matched"> | Date | string
  }

  export type ProcessedEmailUpsertWithWhereUniqueWithoutUserInput = {
    where: ProcessedEmailWhereUniqueInput
    update: XOR<ProcessedEmailUpdateWithoutUserInput, ProcessedEmailUncheckedUpdateWithoutUserInput>
    create: XOR<ProcessedEmailCreateWithoutUserInput, ProcessedEmailUncheckedCreateWithoutUserInput>
  }

  export type ProcessedEmailUpdateWithWhereUniqueWithoutUserInput = {
    where: ProcessedEmailWhereUniqueInput
    data: XOR<ProcessedEmailUpdateWithoutUserInput, ProcessedEmailUncheckedUpdateWithoutUserInput>
  }

  export type ProcessedEmailUpdateManyWithWhereWithoutUserInput = {
    where: ProcessedEmailScalarWhereInput
    data: XOR<ProcessedEmailUpdateManyMutationInput, ProcessedEmailUncheckedUpdateManyWithoutUserInput>
  }

  export type ProcessedEmailScalarWhereInput = {
    AND?: ProcessedEmailScalarWhereInput | ProcessedEmailScalarWhereInput[]
    OR?: ProcessedEmailScalarWhereInput[]
    NOT?: ProcessedEmailScalarWhereInput | ProcessedEmailScalarWhereInput[]
    id?: StringFilter<"ProcessedEmail"> | string
    gmailId?: StringFilter<"ProcessedEmail"> | string
    userEmail?: StringFilter<"ProcessedEmail"> | string
    subject?: StringFilter<"ProcessedEmail"> | string
    from?: StringFilter<"ProcessedEmail"> | string
    attachmentCount?: IntFilter<"ProcessedEmail"> | number
    processedAt?: DateTimeFilter<"ProcessedEmail"> | Date | string
  }

  export type UserCreateWithoutLedgersInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    banks?: BankCreateNestedManyWithoutUserInput
    matched?: MatchedCreateNestedManyWithoutUserInput
    processedEmails?: ProcessedEmailCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLedgersInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    banks?: BankUncheckedCreateNestedManyWithoutUserInput
    matched?: MatchedUncheckedCreateNestedManyWithoutUserInput
    processedEmails?: ProcessedEmailUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLedgersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLedgersInput, UserUncheckedCreateWithoutLedgersInput>
  }

  export type MatchedCreateWithoutLedgerInput = {
    id?: string
    bankTransaction: string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    matchScore?: number
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutMatchedInput
    bank: BankCreateNestedOneWithoutMatchedInput
  }

  export type MatchedUncheckedCreateWithoutLedgerInput = {
    id?: string
    userEmail: string
    bankId: string
    bankTransaction: string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    matchScore?: number
    createdAt?: Date | string
  }

  export type MatchedCreateOrConnectWithoutLedgerInput = {
    where: MatchedWhereUniqueInput
    create: XOR<MatchedCreateWithoutLedgerInput, MatchedUncheckedCreateWithoutLedgerInput>
  }

  export type MatchedCreateManyLedgerInputEnvelope = {
    data: MatchedCreateManyLedgerInput | MatchedCreateManyLedgerInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutLedgersInput = {
    update: XOR<UserUpdateWithoutLedgersInput, UserUncheckedUpdateWithoutLedgersInput>
    create: XOR<UserCreateWithoutLedgersInput, UserUncheckedCreateWithoutLedgersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLedgersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLedgersInput, UserUncheckedUpdateWithoutLedgersInput>
  }

  export type UserUpdateWithoutLedgersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    banks?: BankUpdateManyWithoutUserNestedInput
    matched?: MatchedUpdateManyWithoutUserNestedInput
    processedEmails?: ProcessedEmailUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLedgersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    banks?: BankUncheckedUpdateManyWithoutUserNestedInput
    matched?: MatchedUncheckedUpdateManyWithoutUserNestedInput
    processedEmails?: ProcessedEmailUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MatchedUpsertWithWhereUniqueWithoutLedgerInput = {
    where: MatchedWhereUniqueInput
    update: XOR<MatchedUpdateWithoutLedgerInput, MatchedUncheckedUpdateWithoutLedgerInput>
    create: XOR<MatchedCreateWithoutLedgerInput, MatchedUncheckedCreateWithoutLedgerInput>
  }

  export type MatchedUpdateWithWhereUniqueWithoutLedgerInput = {
    where: MatchedWhereUniqueInput
    data: XOR<MatchedUpdateWithoutLedgerInput, MatchedUncheckedUpdateWithoutLedgerInput>
  }

  export type MatchedUpdateManyWithWhereWithoutLedgerInput = {
    where: MatchedScalarWhereInput
    data: XOR<MatchedUpdateManyMutationInput, MatchedUncheckedUpdateManyWithoutLedgerInput>
  }

  export type UserCreateWithoutBanksInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ledgers?: LedgerCreateNestedManyWithoutUserInput
    matched?: MatchedCreateNestedManyWithoutUserInput
    processedEmails?: ProcessedEmailCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBanksInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ledgers?: LedgerUncheckedCreateNestedManyWithoutUserInput
    matched?: MatchedUncheckedCreateNestedManyWithoutUserInput
    processedEmails?: ProcessedEmailUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBanksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBanksInput, UserUncheckedCreateWithoutBanksInput>
  }

  export type MatchedCreateWithoutBankInput = {
    id?: string
    bankTransaction: string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    matchScore?: number
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutMatchedInput
    ledger: LedgerCreateNestedOneWithoutMatchedInput
  }

  export type MatchedUncheckedCreateWithoutBankInput = {
    id?: string
    userEmail: string
    ledgerId: string
    bankTransaction: string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    matchScore?: number
    createdAt?: Date | string
  }

  export type MatchedCreateOrConnectWithoutBankInput = {
    where: MatchedWhereUniqueInput
    create: XOR<MatchedCreateWithoutBankInput, MatchedUncheckedCreateWithoutBankInput>
  }

  export type MatchedCreateManyBankInputEnvelope = {
    data: MatchedCreateManyBankInput | MatchedCreateManyBankInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutBanksInput = {
    update: XOR<UserUpdateWithoutBanksInput, UserUncheckedUpdateWithoutBanksInput>
    create: XOR<UserCreateWithoutBanksInput, UserUncheckedCreateWithoutBanksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBanksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBanksInput, UserUncheckedUpdateWithoutBanksInput>
  }

  export type UserUpdateWithoutBanksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ledgers?: LedgerUpdateManyWithoutUserNestedInput
    matched?: MatchedUpdateManyWithoutUserNestedInput
    processedEmails?: ProcessedEmailUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBanksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ledgers?: LedgerUncheckedUpdateManyWithoutUserNestedInput
    matched?: MatchedUncheckedUpdateManyWithoutUserNestedInput
    processedEmails?: ProcessedEmailUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MatchedUpsertWithWhereUniqueWithoutBankInput = {
    where: MatchedWhereUniqueInput
    update: XOR<MatchedUpdateWithoutBankInput, MatchedUncheckedUpdateWithoutBankInput>
    create: XOR<MatchedCreateWithoutBankInput, MatchedUncheckedCreateWithoutBankInput>
  }

  export type MatchedUpdateWithWhereUniqueWithoutBankInput = {
    where: MatchedWhereUniqueInput
    data: XOR<MatchedUpdateWithoutBankInput, MatchedUncheckedUpdateWithoutBankInput>
  }

  export type MatchedUpdateManyWithWhereWithoutBankInput = {
    where: MatchedScalarWhereInput
    data: XOR<MatchedUpdateManyMutationInput, MatchedUncheckedUpdateManyWithoutBankInput>
  }

  export type UserCreateWithoutMatchedInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ledgers?: LedgerCreateNestedManyWithoutUserInput
    banks?: BankCreateNestedManyWithoutUserInput
    processedEmails?: ProcessedEmailCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMatchedInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ledgers?: LedgerUncheckedCreateNestedManyWithoutUserInput
    banks?: BankUncheckedCreateNestedManyWithoutUserInput
    processedEmails?: ProcessedEmailUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMatchedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMatchedInput, UserUncheckedCreateWithoutMatchedInput>
  }

  export type LedgerCreateWithoutMatchedInput = {
    id?: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutLedgersInput
  }

  export type LedgerUncheckedCreateWithoutMatchedInput = {
    id?: string
    userEmail: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LedgerCreateOrConnectWithoutMatchedInput = {
    where: LedgerWhereUniqueInput
    create: XOR<LedgerCreateWithoutMatchedInput, LedgerUncheckedCreateWithoutMatchedInput>
  }

  export type BankCreateWithoutMatchedInput = {
    id?: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBanksInput
  }

  export type BankUncheckedCreateWithoutMatchedInput = {
    id?: string
    userEmail: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BankCreateOrConnectWithoutMatchedInput = {
    where: BankWhereUniqueInput
    create: XOR<BankCreateWithoutMatchedInput, BankUncheckedCreateWithoutMatchedInput>
  }

  export type UserUpsertWithoutMatchedInput = {
    update: XOR<UserUpdateWithoutMatchedInput, UserUncheckedUpdateWithoutMatchedInput>
    create: XOR<UserCreateWithoutMatchedInput, UserUncheckedCreateWithoutMatchedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMatchedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMatchedInput, UserUncheckedUpdateWithoutMatchedInput>
  }

  export type UserUpdateWithoutMatchedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ledgers?: LedgerUpdateManyWithoutUserNestedInput
    banks?: BankUpdateManyWithoutUserNestedInput
    processedEmails?: ProcessedEmailUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMatchedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ledgers?: LedgerUncheckedUpdateManyWithoutUserNestedInput
    banks?: BankUncheckedUpdateManyWithoutUserNestedInput
    processedEmails?: ProcessedEmailUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LedgerUpsertWithoutMatchedInput = {
    update: XOR<LedgerUpdateWithoutMatchedInput, LedgerUncheckedUpdateWithoutMatchedInput>
    create: XOR<LedgerCreateWithoutMatchedInput, LedgerUncheckedCreateWithoutMatchedInput>
    where?: LedgerWhereInput
  }

  export type LedgerUpdateToOneWithWhereWithoutMatchedInput = {
    where?: LedgerWhereInput
    data: XOR<LedgerUpdateWithoutMatchedInput, LedgerUncheckedUpdateWithoutMatchedInput>
  }

  export type LedgerUpdateWithoutMatchedInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLedgersNestedInput
  }

  export type LedgerUncheckedUpdateWithoutMatchedInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BankUpsertWithoutMatchedInput = {
    update: XOR<BankUpdateWithoutMatchedInput, BankUncheckedUpdateWithoutMatchedInput>
    create: XOR<BankCreateWithoutMatchedInput, BankUncheckedCreateWithoutMatchedInput>
    where?: BankWhereInput
  }

  export type BankUpdateToOneWithWhereWithoutMatchedInput = {
    where?: BankWhereInput
    data: XOR<BankUpdateWithoutMatchedInput, BankUncheckedUpdateWithoutMatchedInput>
  }

  export type BankUpdateWithoutMatchedInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBanksNestedInput
  }

  export type BankUncheckedUpdateWithoutMatchedInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutProcessedEmailsInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ledgers?: LedgerCreateNestedManyWithoutUserInput
    banks?: BankCreateNestedManyWithoutUserInput
    matched?: MatchedCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProcessedEmailsInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ledgers?: LedgerUncheckedCreateNestedManyWithoutUserInput
    banks?: BankUncheckedCreateNestedManyWithoutUserInput
    matched?: MatchedUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProcessedEmailsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProcessedEmailsInput, UserUncheckedCreateWithoutProcessedEmailsInput>
  }

  export type UserUpsertWithoutProcessedEmailsInput = {
    update: XOR<UserUpdateWithoutProcessedEmailsInput, UserUncheckedUpdateWithoutProcessedEmailsInput>
    create: XOR<UserCreateWithoutProcessedEmailsInput, UserUncheckedCreateWithoutProcessedEmailsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProcessedEmailsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProcessedEmailsInput, UserUncheckedUpdateWithoutProcessedEmailsInput>
  }

  export type UserUpdateWithoutProcessedEmailsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ledgers?: LedgerUpdateManyWithoutUserNestedInput
    banks?: BankUpdateManyWithoutUserNestedInput
    matched?: MatchedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProcessedEmailsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ledgers?: LedgerUncheckedUpdateManyWithoutUserNestedInput
    banks?: BankUncheckedUpdateManyWithoutUserNestedInput
    matched?: MatchedUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LedgerCreateManyUserInput = {
    id?: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BankCreateManyUserInput = {
    id?: string
    date: Date | string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MatchedCreateManyUserInput = {
    id?: string
    ledgerId: string
    bankId: string
    bankTransaction: string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    matchScore?: number
    createdAt?: Date | string
  }

  export type ProcessedEmailCreateManyUserInput = {
    id?: string
    gmailId: string
    subject: string
    from: string
    attachmentCount?: number
    processedAt?: Date | string
  }

  export type LedgerUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matched?: MatchedUpdateManyWithoutLedgerNestedInput
  }

  export type LedgerUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matched?: MatchedUncheckedUpdateManyWithoutLedgerNestedInput
  }

  export type LedgerUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BankUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matched?: MatchedUpdateManyWithoutBankNestedInput
  }

  export type BankUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matched?: MatchedUncheckedUpdateManyWithoutBankNestedInput
  }

  export type BankUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    bankTransaction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    matchScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ledger?: LedgerUpdateOneRequiredWithoutMatchedNestedInput
    bank?: BankUpdateOneRequiredWithoutMatchedNestedInput
  }

  export type MatchedUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ledgerId?: StringFieldUpdateOperationsInput | string
    bankId?: StringFieldUpdateOperationsInput | string
    bankTransaction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    matchScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchedUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ledgerId?: StringFieldUpdateOperationsInput | string
    bankId?: StringFieldUpdateOperationsInput | string
    bankTransaction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    matchScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessedEmailUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    gmailId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    from?: StringFieldUpdateOperationsInput | string
    attachmentCount?: IntFieldUpdateOperationsInput | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessedEmailUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    gmailId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    from?: StringFieldUpdateOperationsInput | string
    attachmentCount?: IntFieldUpdateOperationsInput | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessedEmailUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    gmailId?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    from?: StringFieldUpdateOperationsInput | string
    attachmentCount?: IntFieldUpdateOperationsInput | number
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchedCreateManyLedgerInput = {
    id?: string
    userEmail: string
    bankId: string
    bankTransaction: string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    matchScore?: number
    createdAt?: Date | string
  }

  export type MatchedUpdateWithoutLedgerInput = {
    id?: StringFieldUpdateOperationsInput | string
    bankTransaction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    matchScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMatchedNestedInput
    bank?: BankUpdateOneRequiredWithoutMatchedNestedInput
  }

  export type MatchedUncheckedUpdateWithoutLedgerInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    bankId?: StringFieldUpdateOperationsInput | string
    bankTransaction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    matchScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchedUncheckedUpdateManyWithoutLedgerInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    bankId?: StringFieldUpdateOperationsInput | string
    bankTransaction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    matchScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchedCreateManyBankInput = {
    id?: string
    userEmail: string
    ledgerId: string
    bankTransaction: string
    description: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    matchScore?: number
    createdAt?: Date | string
  }

  export type MatchedUpdateWithoutBankInput = {
    id?: StringFieldUpdateOperationsInput | string
    bankTransaction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    matchScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMatchedNestedInput
    ledger?: LedgerUpdateOneRequiredWithoutMatchedNestedInput
  }

  export type MatchedUncheckedUpdateWithoutBankInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    ledgerId?: StringFieldUpdateOperationsInput | string
    bankTransaction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    matchScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchedUncheckedUpdateManyWithoutBankInput = {
    id?: StringFieldUpdateOperationsInput | string
    userEmail?: StringFieldUpdateOperationsInput | string
    ledgerId?: StringFieldUpdateOperationsInput | string
    bankTransaction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    matchScore?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}