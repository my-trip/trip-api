<template>
	<CInputGroup class="mb-3">
		<CFormInput ref="inputRef" type="text" />
	</CInputGroup>
</template>

<script>
import { useCurrencyInput } from 'vue-currency-input'

export default {
	name: 'CurrencyInput',
	props: {
		modelValue: Number, // Vue 2: value
		options: Object
	},
	setup(props) {
		const { inputRef } = useCurrencyInput(props.options)

		return { inputRef }
	}
}
</script>