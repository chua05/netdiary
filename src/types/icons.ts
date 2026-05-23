import type { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';

export type AppIconName = ComponentProps<typeof SymbolView>['name'];
