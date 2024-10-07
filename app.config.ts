export default defineAppConfig({
  ui: {
    primary: 'customViolet',
    gray: 'slate',
    container: {
      constrained: 'max-w-full'
    },
    button: {
      variant: {
        ghost: 'text-customViolet-950 dark:text-customViolet-50 hover:bg-customViolet-200 dark:hover:bg-customViolet-900',
        solid: 'bg-[--medium-violet] text-white dark:bg-[--medium-violet] dark:text-white hover:bg-[--light-violet] dark:hover:bg-[--light-violet',
        link: 'text-gray-900 dark:text-white hover:text-gray-900 hover:dark:text-white'
      },
      default: {
        loadingIcon: 'i-mdi-loading'
      }
    },
    divider: {
      border: {
        base: 'border-customViolet-950 dark:border-white'
      },
      container: {
        vertical: 'my-8'
      }
    },
    notifications: {
      position: 'bottom-0 right-0'
    }
  }
})
