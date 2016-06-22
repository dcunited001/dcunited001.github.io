# TODO: update so {% pic blah blah blah %} automatically generates a properly formatted pic
# - need specifically formatted HTML for each image,
# - so that image is centered and so is the h4/h3 title
# - also would be nice to be able to include copyright info

module Jekyll
  class PicImageTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text
    end

    def render(context)
      # padding(l/r) should be auto on <div>
      "<div><h4>a picture</h4><img src=\"\" /></div>"
    end
  end
end

#Liquid::Template.register_tag('pic', Jekyll::PicImageTag)
