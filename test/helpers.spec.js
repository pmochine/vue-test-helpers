import { mount as originalMount, shallow as originalShallow } from '@vue/test-utils'
import Basic from './components/Basic.vue'
import Contains from './components/Contains.vue'
import Events from './components/Events.vue'
import Inputs from './components/Inputs.vue'
import Props from './components/Props.vue'
import setupHelpers from '../src/index'

describe('vue-test-helpers', () => {
  setupHelpers()

  it('registers mount and shallow globally', () => {
    mount.should.equal(originalMount)
    shallow.should.equal(originalShallow)
  })

  it('has', () => {
    const wrapper = mount(Basic)
    wrapper.has.should.equal(wrapper.contains)
  })

  it('hasAll', () => {
    const wrapper = shallow(Contains)
    wrapper.hasAll('.foo', '.bar').should.be.true
    wrapper.containsAll('.foo', '.baz').should.be.false
  })

  it('hasAny', () => {
    const wrapper = shallow(Contains)
    wrapper.hasAny('.foo', '.bar').should.be.true
    wrapper.containsAny('.foo', '.baz').should.be.true
    wrapper.hasAny('.baz', '.qux').should.be.false
  })

  it('hasNone', () => {
    const wrapper = shallow(Contains)
    wrapper.hasNone('.foo', '.bar').should.be.false
    wrapper.containsNone('.foo', '.baz').should.be.false
    wrapper.doesntHaveAny('.baz', '.qux').should.be.true
  })

  it('hasClass(es)', () => {
    const wrapper = shallow(Basic)
    wrapper.find('.foo').hasClass('foo').should.be.true
    wrapper.find('.foo').hasClasses('foo', 'fooo').should.be.true
  })

  it('hasAttribute', () => {
    const wrapper = shallow(Basic)
    wrapper.find('.disabled').hasAttribute('disabled', 'disabled').should.be.true
  })

  it('hasProp', () => {
    const wrapper = shallow(Props, { propsData: {
      foo: 'bar'
    }})
    wrapper.hasProp('foo', 'bar').should.be.true
  })

  it('id', () => {
    const wrapper = shallow(Basic)
    wrapper.find('#bar').id().should.equal('bar')
  })

  it('triggers events', () => {
    const wrapper = shallow(Events)
    const clickStub = sinon.stub(wrapper.vm, 'click')
    const dblclickStub = sinon.stub(wrapper.vm, 'dblclick')
    const submitStub = sinon.stub(wrapper.vm, 'submit')
    wrapper.click('.click')
    wrapper.dblclick('.dblclick')
    wrapper.submit('form')
    clickStub.called.should.be.true
    dblclickStub.called.should.be.true
    submitStub.calledWith('foo').should.be.true

    clickStub.restore()
    dblclickStub.restore()
    submitStub.restore()
  })

  it('gets/sets values', () => {
    const wrapper = shallow(Inputs)
    wrapper.find('.foo').value = 'Bar'
    wrapper.find('.foo').element.value.should.equal('Bar')
    wrapper.find('.foo').element.value = 'Baz'
    wrapper.find('.foo').value.should.equal('Baz')
  })

  it('setValue', () => {
    const wrapper = shallow(Inputs)
    const input = wrapper.find('.foo')
    input.setValue('Foo').should.equal(input)
    wrapper.find('.foo').element.value.should.equal('Foo')
  })

  it('getValue', () => {
    const wrapper = shallow(Inputs)
    wrapper.find('.foo').setValue('Foo')
    wrapper.find('.foo').element.value.should.equal('Foo')
  })

  it('hasEmitted', () => {
    const wrapper = shallow(Events)
    wrapper.click('.click')
    wrapper.dblclick('.dblclick')
    wrapper.hasEmitted('clicked').should.be.true
    wrapper.hasEmitted('clicked', 10).should.be.true
    wrapper.hasEmitted('dblclicked', [41, 42]).should.be.true
  })
})