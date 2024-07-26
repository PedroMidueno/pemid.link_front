export default defineAppConfig({
  ui: {
    primary: 'customViolet',
    gray: 'slate',
    container: {
      constrained: 'max-w-full'
    },
    button: {
      variant: {
        ghost: 'text-customViolet-950 dark:text-customViolet-50 hover:bg-customViolet-200 dark:hover:bg-customViolet-900'
      }
    }
  }
})
