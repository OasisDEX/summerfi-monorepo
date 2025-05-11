#!/bin/zsh

PREPEND_DATA=$(cat <<'EOF'
@import 'include-media/dist/_include-media.scss';
$breakpoints: (
  s: 531px,
  m: 744px,
  l: 1025px,
  xl: 1279px,
);
EOF
)

for scss in $(find . -name "*.scss"); do
  tmpfile="${scss}.tmp"
  echo "$PREPEND_DATA" > "$tmpfile"
  cat "$scss" >> "$tmpfile"
  cssfile="${scss%.scss}.css"
  sass --no-source-map --load-path=node_modules "$tmpfile" "$cssfile"
  status=$?
  rm "$tmpfile"
  if [ $status -ne 0 ]; then
    echo "Sass compilation failed for $scss. Stopping script."
    exit 1
  fi
done

echo "All SCSS files compiled to CSS with prependData."