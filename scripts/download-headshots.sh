#!/bin/bash

# Create directory
mkdir -p public/images/team
cd public/images/team

# Download all headshots in parallel
curl -L -o zhijing-jin.png "https://zhijing-jin.com/home/wp-content/uploads/2026/02/profile_circle.png" &
curl -L -o terry-zhang.png "https://scholar.googleusercontent.com/citations?view_op=medium_photo&user=hFY4t8gAAAAJ&citpid=3" &
curl -L -o yongjin-yang.png "https://yangyongjin.github.io/assets/img/yongjin_profile.png" &
curl -L -o rohan-subramani.png "https://ca.slack-edge.com/T013MAR86FN-U08LCV1SFPD-f92c3c12b36b-512" &
curl -L -o ryan-faulkner.jpg "https://scholar.googleusercontent.com/citations?view_op=medium_photo&user=F0nxdKYAAAAJ&citpid=8" &
curl -L -o andrei-muresanu.jpg "https://andreimuresanu.github.io/images/linkedin_photo_sept-7-2024.jpg" &
curl -L -o yahang-qi.png "https://ca.slack-edge.com/T013MAR86FN-U06NH2YK7DH-f4034b1aa75e-512" &
curl -L -o furkan-danisman.png "https://avatars.githubusercontent.com/u/132205218?v=4" &
curl -L -o samuel-simko.png "https://ca.slack-edge.com/T013MAR86FN-U07MYT0Q4HX-d0d115e4c272-192" &
curl -L -o abir-harrasse.jpeg "https://abirharrasse.github.io/images/photo_abir.jpeg" &
curl -L -o keenan-samway.png "https://ca.slack-edge.com/T013MAR86FN-U083L7KBCTW-e8e8fddc43f4-512" &
curl -L -o david-guzman.png "https://ca.slack-edge.com/T013MAR86FN-U07SQ0B49KK-ab93ab976b9c-192" &
curl -L -o changling-li.png "https://ca.slack-edge.com/T013MAR86FN-U08SH5JGGRW-dc578e1650da-512" &
curl -L -o pepijn-cobben.png "https://ca.slack-edge.com/T013MAR86FN-U08TZ3481J6-5b9cb2035bd3-512" &
curl -L -o jiarui-liu.jpg "https://jiarui-liu.github.io/authors/admin/avatar_hu2946d1e4b453db27be37bfff63bcd25a_469921_270x270_fill_q75_lanczos_center.jpg" &
curl -L -o angelo-huang.png "https://ca.slack-edge.com/T013MAR86FN-U09ARMTL141-b02678990a12-512" &
curl -L -o vishal-verma.jpg "https://www.cmu.edu/dietrich/causality/assets/img/people_images/verma_vishal.jpg" &
curl -L -o punya-pandey.png "https://ca.slack-edge.com/T013MAR86FN-U086REHRRJQ-6f570c1b0d42-512" &
curl -L -o irene-strauss.png "https://ca.slack-edge.com/T013MAR86FN-U08AD9QG4DD-898f1035c4b6-512" &
curl -L -o sawal-acharya.jpg "https://plevritislab.stanford.edu/sites/g/files/sbiybj30386/files/styles/square_1900/public/media/image/sawal_0.jpg?h=d318f057&itok=gXR-tcZr" &
curl -L -o joeun-yook.png "https://ca.slack-edge.com/T013MAR86FN-U091X67SNE9-6e39b0442a79-512" &

# Wait for all downloads to complete
wait

echo "All headshots downloaded to public/images/team/"
ls -la
