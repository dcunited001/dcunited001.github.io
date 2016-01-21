def get_unique_tags(posts)

  posts.reduce({}) do |memo, p|
    p.tags.each do |t|
      slug = Jekyll::Utils.slugify(t)
      tag_name = t.split('-').map(&:capitalize).join(' ')
      memo[slug] = tag_name
    end

    memo
  end
end

def write_tag_files(tags)
  tags.each do |t|
    tag_path = get_tag_page_path(t[:slug])
    unless File.exist?(tag_path)
      File.open(tag_path, 'w') { |f|
        f.write(get_tag_file_content(t[:slug]))
      }
    end
  end
end


def get_tag_file_content(slug)
<<EOS
---
layout: tag
tag: #{slug}
parmalink: /tags/#{slug}
---
EOS
end

def get_tags_yaml_filename
  File.join(File.dirname(__FILE__), '..', '_data', 'tags.yml')
end

def get_tag_page_path(slug)
  File.join(File.dirname(__FILE__), '..', 'tags', "#{slug}.md")
end

def read_tags_yaml
  YAML.load(File.open(get_tags_yaml_filename))
rescue
  puts "run `touch ./_data/tags.yml`"
end

def slugify_tags(tags)
  # slugify_tags is no longer required for write_tag_yaml
  # - glad i happened to catch that
  tags.reduce([]) {|memo, (k,v)|
    memo << {slug: k, name: v}
  }
end

def write_tag_yaml(tags)
  # assuming __FILE__ is ./_plugins
  yaml_filename = get_tags_yaml_filename
  File.open(yaml_filename, 'w') do |f|
    f.write(tags.to_yaml)
  end
end

Jekyll::Hooks.register :site, :pre_render do |site|
  old_tags = read_tags_yaml
  tags = slugify_tags(get_unique_tags(site.posts))

  write_tag_yaml(tags) unless tags == old_tags
  write_tag_files(tags)
end
