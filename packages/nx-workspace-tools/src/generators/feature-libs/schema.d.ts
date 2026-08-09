export interface FeatureLibsGeneratorSchema {
  /**
   * Path where the libraries should be created
   */
  libsPath: string;
  /**
   * Optional workspace prefix. When omitted, the generator will derive it from
   * `package.json` using {@link getWorkspacePrefix}.
   */
  workspacePrefix?: string;
  ressourceNameSingular: string;
  ressourceNamePlural: string;
  libTypes: ('feature' | 'data-access' | 'ui' | 'types' | 'util')[];
  /**
   * Whether to create a project.json file for the generated library.
   */
  useProjectJson?: boolean;
}
