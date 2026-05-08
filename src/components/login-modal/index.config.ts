export default typeof definePageConfig === 'function'
  ? definePageConfig({
      disableScroll: true,
    })
  : {}
