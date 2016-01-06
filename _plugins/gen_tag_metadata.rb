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

end

def get_tags_yaml_filename
  File.join(File.dirname(__FILE__), '..', '_data', 'tags.yml')
end

def read_tags_yaml
  YAML.load(File.open(get_tags_yaml_filename))
rescue
  puts "run `touch ./_data/tags.yml`"
end

def slugify_tags(tags)
  tags.reduce([]) {|memo, (k,v)|
    memo << {slug: k, name: v}
  }
end

def write_tag_yaml(tags)
  # assuming __FILE__ is ./_plugins
  yaml_filename = get_tags_yaml_filename
  File.open(yaml_filename, 'w') do |f|
    tags_list = slugify_tags(tags)
    f.write(tags_list.to_yaml)
  end
end

Jekyll::Hooks.register :site, :pre_render do |site|
  old_tags = read_tags_yaml
  tags = get_unique_tags(site.posts)


  unless slugify_tags(tags) == old_tags
    write_tag_yaml(tags)

  end
end
