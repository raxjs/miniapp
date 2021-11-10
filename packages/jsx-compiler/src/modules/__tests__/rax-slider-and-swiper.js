const t = require('@babel/types');
const { _transformRaxSliderAndSwiper } = require('../rax-slider-and-swiper');
const genExpression = require('../../codegen/genExpression');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter').wechat;

describe('Transform rax-slider', () => {
  it('should transform simple case', () => {
    const ast = parseExpression(`
        <View>
          <rax-slider>
            <swiper-item>1</swiper-item>
            <swiper-item>2</swiper-item>
            <swiper-item>3</swiper-item>
          </rax-slider>
        </View>
      `);
    _transformRaxSliderAndSwiper(ast);
    expect(genExpression(ast)).toEqual(`<View>
          <rax-slider __length="{{3}}">
            <swiper-item slot="slider-item-{{0}}">1</swiper-item>
            <swiper-item slot="slider-item-{{1}}">2</swiper-item>
            <swiper-item slot="slider-item-{{2}}">3</swiper-item>
          </rax-slider>
        </View>`);
  });

  it('should transform difficult case', () => {
    const ast = parseExpression(`
        <View>
          <rax-slider>
            <swiper-item>1</swiper-item>
            <swiper-item wx:for="{{data}}" wx:for-index="index">2</swiper-item>
            <swiper-item wx:for="{{data1}}" wx:for-index="index0">3</swiper-item>
          </rax-slider>
        </View>
      `);
    _transformRaxSliderAndSwiper(ast, adapter);
    expect(genExpression(ast)).toEqual(`<View>
          <rax-slider __length="{{1+data.length+data1.length}}">
            <swiper-item slot="slider-item-{{0}}">1</swiper-item>
            <swiper-item wx:for="{{data}}" wx:for-index="index" slot="slider-item-{{1+index}}">2</swiper-item>
            <swiper-item wx:for="{{data1}}" wx:for-index="index0" slot="slider-item-{{1+data.length+index0}}">3</swiper-item>
          </rax-slider>
        </View>`);
  });
});

describe('Transform rax-swiper', () => {
  it('should transform simple case', () => {
    const ast = parseExpression(`
        <View>
          <rax-swiper>
            <swiper-item>1</swiper-item>
            <swiper-item>2</swiper-item>
            <swiper-item>3</swiper-item>
          </rax-swiper>
        </View>
      `);
    _transformRaxSliderAndSwiper(ast);
    expect(genExpression(ast)).toEqual(`<View>
          <rax-swiper __length="{{3}}">
            <swiper-item slot="slider-item-{{0}}">1</swiper-item>
            <swiper-item slot="slider-item-{{1}}">2</swiper-item>
            <swiper-item slot="slider-item-{{2}}">3</swiper-item>
          </rax-swiper>
        </View>`);
  });

  it('should transform difficult case', () => {
    const ast = parseExpression(`
        <View>
          <rax-swiper>
            <swiper-item>1</swiper-item>
            <swiper-item wx:for="{{data}}" wx:for-index="index">2</swiper-item>
            <swiper-item wx:for="{{data1}}" wx:for-index="index0">3</swiper-item>
          </rax-swiper>
        </View>
      `);
    _transformRaxSliderAndSwiper(ast, adapter);
    expect(genExpression(ast)).toEqual(`<View>
          <rax-swiper __length="{{1+data.length+data1.length}}">
            <swiper-item slot="slider-item-{{0}}">1</swiper-item>
            <swiper-item wx:for="{{data}}" wx:for-index="index" slot="slider-item-{{1+index}}">2</swiper-item>
            <swiper-item wx:for="{{data1}}" wx:for-index="index0" slot="slider-item-{{1+data.length+index0}}">3</swiper-item>
          </rax-swiper>
        </View>`);
  });
});
