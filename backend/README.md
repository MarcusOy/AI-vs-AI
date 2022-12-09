# Ai vs Ai Backend

## Setup

Make sure you have the following:

- [.NET Core 6 SDK](https://dotnet.microsoft.com/download)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [C# Extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)

Recommended:

- [Insomnia](https://insomnia.rest/download)

You may try using [Rider](https://www.jetbrains.com/rider/) if you are more familiar with JetBrains IDEs such as InteliJ.

You can check if they are installed globally with these commands respectively:

- `dotnet --list-sdks` (check for version 6+)
- `code .` (should launch Visual Studio Code)
- C# Extension should appear in the list of extensions

Once `dotnet` is installed, install two global tools needed for this project:

- `dotnet tool install --global dotnet-ef`
- `dotnet tool install --global dotnet-typegen --version 3.1.0`

This project also needs TypeScript to be installed to allow for TypeScript strategies:

- `npm install -g typescript`

## Development

Make sure [Docker](https://www.docker.com/) and [.NET Core SDK 6](https://dotnet.microsoft.com/en-us/download/dotnet/6.0) are installed.

Run the full development `mysql` stack by using command:

```bash
docker-compose up
```

Or maybe you just want the database running:

```bash
docker-compose db
```

> Check the service names within the docker-compose.yml file so that you know what names are valid.

On first clone, you will be missing a `.env` file. This file will contain applcation configuration data, such as the database connection string. Go ahead and make a copy of the template file called `sample.env` and start filling out the different values.

> This file isn't checked into source control to prevent sensitive information/secrets from being checked in (and viewable to the public) and to prevent conflicts between developers.

Run the project:

```bash
dotnet run
```

You can add `watch` before `run` to tell .NET to hot reload changes.

```bash
dotnet watch run
```

> If the `dotnet` command fails to run because of the port already being used or a process is already locking the .dll file, use command `ps | grep "dotnet\|LCIdentityVerify" | cut -c 1-5 | sudo xargs kill` to end all dotnet related processes.

> The database schema will be created and the database will be seeded when the app is ran.

### Database migrations

If you change the schema, you need to create a migration (a file that contains the difference between schema versions). To create a new migration, use command:

```bash
dotnet ef migrations add <migration_name>
```

The workflow for changing the schema is as follows:

1. Make the change in the model.
2. Run `dotnet ef migrations add <migration name>`.
3. Start the application. Optionally, if you want to update the database schema without running the app, use command `dotnet database update` instead.

> If this command doesn't work, use command `dotnet tool install --global dotnet-ef` to install the Entity Framework Core cli tools.

## Exploration of Contents

### Project File

Each .NET project starts with a `.csproj` file. This file contains information about what version of .NET is being used to run the app, build configurations, and external packages. This file's purpose is similar to a `package.json` found in Javascript projects.

### Configuration

.NET configures the application using `appsettings.json` files (you will see multiple of these files per environment, such as `appsettings.Development.json`). We will not touch these files, as we want to configure the application via environment variables.

Environment variables can be set in different ways depending on which environment the application is being run. We will have three environments in which an application will run:

- Development
- Staging
- Production

Any work done on your local machine will be within the Development environment. To set environment variables, you may either set them within your shell using commands:

```bash
# on macos/linux
export VARIABLE_NAME1=Variable Value
export VARIABLE_NAME2=Variable Value

# on windows (in cmd)
setx VARIABLE_NAME1 "Variable Value"
setx VARIABLE_NAME2 "Variable Value"
```

Or having a `.env` file present in the same location as the `.csproj` file with contents:

```env
VARIABLE_NAME1=Variable Value
VARIABLE_NAME2=Variable Value
```

As stated above, the `.env` file is much more prefered.

> Do not worry about Staging and Production, these are setup within our CI/CD pipelines.

### Code

The entrypoint of the application is `Program.cs`. There are two sections of this code:

- The first section defines all of the services that will exist within the application's runtime.
- The second section configures the app's middleware.
