import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import AdminHome from '@/components/AdminHome.vue'

describe('AdminHome.vue', () => {
  it('renders v-card tag', () => {
    const wrapper = shallowMount(AdminHome)
    expect(wrapper.find("v-card")).include("Manage Faculty")
  })
})
