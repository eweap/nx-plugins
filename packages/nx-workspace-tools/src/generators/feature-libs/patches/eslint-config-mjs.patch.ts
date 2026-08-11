import { Tree } from '@nx/devkit';
import { match } from '@phenomnomnominal/tsquery';
import * as ts from 'typescript';

import { LibraryContext } from '../utils/context';
import { createFilePatch, patchFile } from '../utils/patch-file';

const CUSTOM_RULES_EXPORT_NAME = 'customRules';
const ESLINT_CONFIG_FILE_NAME = 'eslint.config.mjs';
const ESLINT_CONFIG_IMPORT_SELECTOR = `ImportDeclaration:has(StringLiteral[text=/${ESLINT_CONFIG_FILE_NAME.replaceAll('.', '\\.')}$/])`;
const EXPORT_DEFAULT_ARRAY_SELECTOR =
  'ExportAssignment > ArrayLiteralExpression';

type TextEdit = {
  position: number;
  text: string;
};

export function patchCustomRules(input: {
  tree: Tree;
  path: string;
  content: string;
}) {
  const sourceFile = ts.createSourceFile(
    input.path,
    input.content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );

  const edits = [
    createCustomRulesImportEdit(sourceFile, input.content),
    createCustomRulesSpreadEdit(sourceFile, input.content),
  ];

  return edits
    .filter((edit): edit is TextEdit => Boolean(edit))
    .sort((left, right) => right.position - left.position)
    .reduce(
      (updatedContent, edit) =>
        `${updatedContent.slice(0, edit.position)}${edit.text}${updatedContent.slice(edit.position)}`,
      input.content,
    );
}

function createCustomRulesImportEdit(
  sourceFile: ts.SourceFile,
  content: string,
): TextEdit | undefined {
  const importDeclaration = match(
    sourceFile,
    ESLINT_CONFIG_IMPORT_SELECTOR,
  ).find(ts.isImportDeclaration);
  const importClause = importDeclaration?.importClause;

  if (!importDeclaration || !importClause) {
    return undefined;
  }

  const namedBindings = importClause.namedBindings;

  if (namedBindings && ts.isNamedImports(namedBindings)) {
    if (
      namedBindings.elements.some(
        (element) => element.name.text === CUSTOM_RULES_EXPORT_NAME,
      )
    ) {
      return undefined;
    }

    const closingBracePosition = namedBindings.getEnd() - 1;
    const insertionPosition = findLastNonWhitespacePositionBefore(
      content,
      closingBracePosition,
    );
    const namedImportsContent = content
      .slice(namedBindings.getStart(sourceFile) + 1, closingBracePosition)
      .trim();

    if (!namedImportsContent) {
      return {
        position: closingBracePosition,
        text: ` ${CUSTOM_RULES_EXPORT_NAME} `,
      };
    }

    const separator = namedImportsContent.endsWith(',') ? ' ' : ', ';

    return {
      position: insertionPosition + 1,
      text: `${separator}${CUSTOM_RULES_EXPORT_NAME}`,
    };
  }

  if (!importClause.name) {
    return undefined;
  }

  return {
    position: importClause.name.getEnd(),
    text: `, { ${CUSTOM_RULES_EXPORT_NAME} }`,
  };
}

function createCustomRulesSpreadEdit(
  sourceFile: ts.SourceFile,
  content: string,
): TextEdit | undefined {
  const exportArray = match(sourceFile, EXPORT_DEFAULT_ARRAY_SELECTOR).find(
    (node): node is ts.ArrayLiteralExpression =>
      ts.isArrayLiteralExpression(node) &&
      ts.isExportAssignment(node.parent) &&
      !node.parent.isExportEquals,
  );

  if (!exportArray) {
    return undefined;
  }

  if (
    exportArray.elements.some(
      (element) =>
        ts.isSpreadElement(element) &&
        ts.isIdentifier(element.expression) &&
        element.expression.text === CUSTOM_RULES_EXPORT_NAME,
    )
  ) {
    return undefined;
  }

  const closingBracketPosition = exportArray.getEnd() - 1;
  const openingBracketPosition = exportArray.getStart(sourceFile);
  const openingLine = sourceFile.getLineAndCharacterOfPosition(
    openingBracketPosition,
  ).line;
  const closingLine = sourceFile.getLineAndCharacterOfPosition(
    closingBracketPosition,
  ).line;

  if (openingLine === closingLine) {
    return {
      position: closingBracketPosition,
      text: exportArray.elements.length
        ? `, ...${CUSTOM_RULES_EXPORT_NAME}`
        : `...${CUSTOM_RULES_EXPORT_NAME}`,
    };
  }

  const firstElement = exportArray.elements.at(0);
  const elementIndent = firstElement
    ? getLineIndent(content, firstElement.getStart(sourceFile))
    : `${getLineIndent(content, closingBracketPosition)}  `;
  const closingLineStart =
    content.lastIndexOf('\n', closingBracketPosition - 1) + 1;

  return {
    position: closingLineStart,
    text: `${elementIndent}...${CUSTOM_RULES_EXPORT_NAME},\n`,
  };
}

function getLineIndent(content: string, position: number) {
  const lineStart = content.lastIndexOf('\n', position - 1) + 1;
  const indentation = /^\s*/.exec(content.slice(lineStart, position));

  return indentation?.[0] ?? '';
}

function findLastNonWhitespacePositionBefore(
  content: string,
  position: number,
) {
  for (let index = position - 1; index >= 0; index -= 1) {
    if (!/\s/.test(content[index])) {
      return index;
    }
  }

  return position;
}

export function patchEslintConfig(tree: Tree, context: LibraryContext) {
  const patches = [createFilePatch(patchCustomRules)];

  patchFile(tree, `${context.projectRoot}/eslint.config.mjs`, patches);
}
